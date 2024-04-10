// Expand the schema of how responses should look.
import { ModelResponseSchema } from "nolita/dist/types/browser/actionStep.types";
import { z } from "zod";

export const CustomSchema = ModelResponseSchema.extend({
  restaurants: z.array(
    z.string().optional().describe("The name of a restaurant"),
  ),
});
