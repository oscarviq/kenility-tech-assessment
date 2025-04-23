import { z, ZodType } from 'zod';
import { extendZodWithOpenApi, OpenAPIRegistry, OpenApiGeneratorV3 } from '@asteasolutions/zod-to-openapi';
import { SchemaObject } from '@nestjs/swagger/dist/interfaces/open-api-spec.interface';

extendZodWithOpenApi(z);
export { z };

export function ZtoOAPI(name: string, schema: ZodType<any>): SchemaObject {
  const registry = new OpenAPIRegistry();
  registry.register(name, schema);
  const generator = new OpenApiGeneratorV3(registry.definitions);
  const { components } = generator.generateComponents();
  return components?.schemas![name] as SchemaObject;
}
