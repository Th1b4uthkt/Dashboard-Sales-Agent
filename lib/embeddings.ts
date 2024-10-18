import Together from "together-ai";

const together = new Together({
  apiKey: process.env.TOGETHER_API_KEY as string
});

export class Embeddings {
  static async generateEmbedding(text: string): Promise<number[]> {
    try {
      const response = await together.embeddings.create({
        model: "togethercomputer/m2-bert-80M-8k-retrieval",
        input: text,
      });
      return response.data[0].embedding;
    } catch (error) {
      console.error('Error generating embedding:', error);
      throw error;
    }
  }
}
