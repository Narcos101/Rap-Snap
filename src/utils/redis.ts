export const storeMaxScoreInRedis = async (context: any, userId: string | undefined, postId: string | undefined, score: number | 0) => {
    try {
      const key = `max_score_${userId}_${postId}`; // Unique key based on userId and postId
  
      // Check if the stored score is less than the current score
      const currentMaxScore = await context.redis.get(key);
  
      // If no score exists, or if the new score is higher, update the Redis value
      if (!currentMaxScore || Number(currentMaxScore) < score) {
        await context.redis.set(key, score.toString()); // Store the new maximum score
      }
    } catch (error) {
        return 0;
    }
  };

export const getMaxScoreFromRedis = async (context: any, userId: string | undefined, postId: string | undefined) => {
    try {
      const key = `max_score_${userId}_${postId}`; // Unique key for user and post
      const score = await context.redis.get(key);
  
      if (score) {
        return Number(score); // Convert the score to a number before returning
      } else {
        return 0; // Default value if no score exists
      }
    } catch (error) {
      return 0; // Return 0 if there is an error
    }
  };
  