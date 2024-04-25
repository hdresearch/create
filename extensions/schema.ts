// Expand the schema of how responses should look.
import { ModelResponseSchema, ObjectiveComplete } from "nolita/dist/types/types";
import { z } from "zod";

export const CustomSchema = ModelResponseSchema(ObjectiveComplete.extend({
  restaurants: z.array(
    z.string().optional().describe("The name of a restaurant")
)}));

export type CustomSchemaType = z.infer<typeof CustomSchema>;