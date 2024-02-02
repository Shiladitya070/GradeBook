from sentence_transformers import SentenceTransformer, util

model = SentenceTransformer("nomic-ai/nomic-embed-text-v1", trust_remote_code=True)


class SimilarScore:
    def __init__(self, sentences):
        self.embeddings = model.encode(sentences)
        self.sim = util.pytorch_cos_sim(self.embeddings[0],self.embeddings[1])

    def similarity(self):
        return self.sim
