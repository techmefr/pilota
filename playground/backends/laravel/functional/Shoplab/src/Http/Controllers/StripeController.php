<?php

namespace Functional\Shoplab\Http\Controllers;

use Functional\Shoplab\Models\ShopOrder;
use Functional\Shoplab\Models\ShopOrderItem;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;

class StripeController extends Controller
{
    public function createCheckoutSession(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'full_name'              => 'required|string|min:2',
            'email'                  => 'required|email',
            'address'                => 'required|string',
            'city'                   => 'required|string',
            'zip_code'               => 'required|string',
            'phone'                  => 'nullable|string',
            'notes'                  => 'nullable|string',
            'items'                  => 'required|array|min:1',
            'items.*.product_id'     => 'required|integer',
            'items.*.product_name'   => 'required|string',
            'items.*.unit_price'     => 'required|numeric|min:0',
            'items.*.quantity'       => 'required|integer|min:1',
        ]);

        $total = collect($validated['items'])->sum(
            fn ($i) => $i['unit_price'] * $i['quantity']
        );

        $order = ShopOrder::create([
            'status'       => 'pending',
            'full_name'    => $validated['full_name'],
            'email'        => $validated['email'],
            'address'      => $validated['address'],
            'city'         => $validated['city'],
            'zip_code'     => $validated['zip_code'],
            'phone'        => $validated['phone'] ?? null,
            'notes'        => $validated['notes'] ?? null,
            'total_amount' => $total,
        ]);

        foreach ($validated['items'] as $item) {
            ShopOrderItem::create([
                'shop_order_id' => $order->id,
                'product_id'    => $item['product_id'],
                'product_name'  => $item['product_name'],
                'unit_price'    => $item['unit_price'],
                'quantity'      => $item['quantity'],
            ]);
        }

        $stripeKey = env('STRIPE_SECRET_KEY');

        if (!$stripeKey) {
            $order->update(['status' => 'paid']);
            $frontendUrl = env('APP_FRONTEND_URL', 'http://main-shoplab.localhost');
            return response()->json([
                'url'      => "{$frontendUrl}/success/{$order->id}?simulated=1",
                'order_id' => $order->id,
                'mode'     => 'simulated',
            ]);
        }

        \Stripe\Stripe::setApiKey($stripeKey);

        $lineItems = array_map(fn ($item) => [
            'price_data' => [
                'currency'     => 'eur',
                'unit_amount'  => (int) round($item['unit_price'] * 100),
                'product_data' => ['name' => $item['product_name']],
            ],
            'quantity' => $item['quantity'],
        ], $validated['items']);

        $frontendUrl = env('APP_FRONTEND_URL', 'http://main-shoplab.localhost');

        $session = \Stripe\Checkout\Session::create([
            'mode'           => 'payment',
            'line_items'     => $lineItems,
            'success_url'    => "{$frontendUrl}/success/{$order->id}?session_id={CHECKOUT_SESSION_ID}",
            'cancel_url'     => "{$frontendUrl}/checkout",
            'customer_email' => $order->email,
            'metadata'       => ['order_id' => $order->id],
        ]);

        $order->update(['stripe_session_id' => $session->id]);

        return response()->json([
            'url'      => $session->url,
            'order_id' => $order->id,
        ]);
    }

    public function confirmSession(string $sessionId): JsonResponse
    {
        $order = ShopOrder::with('items')
            ->where('stripe_session_id', $sessionId)
            ->firstOrFail();

        if ($order->status === 'pending') {
            $stripeKey = env('STRIPE_SECRET_KEY');
            if ($stripeKey) {
                \Stripe\Stripe::setApiKey($stripeKey);
                $session = \Stripe\Checkout\Session::retrieve($sessionId);
                if ($session->payment_status === 'paid') {
                    $order->update([
                        'status'                   => 'paid',
                        'stripe_payment_intent_id' => $session->payment_intent,
                    ]);
                    $order->refresh();
                }
            }
        }

        return response()->json($order->load('items'));
    }

    public function getOrder(int $orderId): JsonResponse
    {
        $order = ShopOrder::with('items')->findOrFail($orderId);
        return response()->json($order);
    }
}
