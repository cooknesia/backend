const recommendationHandler = require('../handlers/recommendationHandler');

module.exports = {
  name: 'recommendations-routes',
  register: async function (server) {
    server.route([
      {
        method: 'POST',
        path: '/api/v1/recommendations',
        handler: recommendationHandler.recommendFoodHandler,
      },
      {
        method: 'GET',
        path: '/api/v1/recommendation-logs/{userId}',
        handler: recommendationHandler.getRecommendationLogsHandler,
      },
    ]);
  },
};
