import type { ZodTypeAny } from 'zod'
import type { AnyResource, Resource, ResourceConfig } from './types.ts'

export function defineResource<TSchema extends ZodTypeAny>(
    config: ResourceConfig<TSchema>,
): Resource<TSchema> {
    return {
        name: config.name,
        schema: config.schema,
        fragments: config.fragments ?? {},
        relations: config.relations ?? {},
    }
}

export function parseMock<TResource extends AnyResource>(
    resource: TResource,
    mock: unknown,
): unknown {
    return resource.schema.parse(mock)
}

export function parseMockList<TResource extends AnyResource>(
    resource: TResource,
    mock: unknown,
): unknown[] {
    if (Array.isArray(mock)) {
        return mock.map(item => resource.schema.parse(item))
    }
    return [resource.schema.parse(mock)]
}
