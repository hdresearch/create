// Expand the schema of how responses should look.
import { ModelResponseSchema } from "nolita/dist/types/browser/actionStep.types";
import { ObjectiveComplete } from "nolita/dist/types/browser/objectiveComplete.types";
import { z } from "zod";

export const CustomSchema = ModelResponseSchema(ObjectiveComplete.extend({
  restaurants: z.array(
    z.string().optional().describe("The name of a restaurant")
)}));

export type CustomSchemaType = z.infer<typeof CustomSchema>;