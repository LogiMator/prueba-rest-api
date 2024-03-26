const z = require("zod");

const movieSchema = z.object({
  title: z.string({
    invalid_type_error: "movie title must be a string",
    required_error: "movie title is required",
  }),

  year: z.number().int().positive().min(1900).max(2050),
  director: z.string(),
  duration: z.number().min(60).max(240),
  poster: z.string().url(),
  rate: z.number().min(0).max(10).default(5),
  genre: z.array(z.enum(["Action", "Drama", "Crime", "Romance"])),
});

const validateMovie = (input) => {
  return movieSchema.safeParse(input);
};

const validatePartialMovie = (input) => {
  return movieSchema.partial().safeParse(input);
};

module.exports = { validateMovie, validatePartialMovie };
