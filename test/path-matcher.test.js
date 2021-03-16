const { expect } = require('chai');

const { pathMatcher } = require('../lib/helpers/schema-utils');


describe('path matcher test', () => {
  it('basic - when schema has only one path /api/v1/sar/reports/:requestId/:otherId - should match', () => {
    const routes = {
      '/api/v1/sar/reports/:requestId/:otherId': { post: 'validator' },
    };
    const routeResult = pathMatcher(routes, '/api/v1/sar/reports/bulk/7127836128736', 'post');
    expect(routeResult).equals('/api/v1/sar/reports/:requestId/:otherId');
  });
  it('when there is no match method request - should return udefined', () => {
    const routes = {
      '/api/v1/sar/reports/:requestId/:otherId': { get: 'validator' },
    };
    const routeResult = pathMatcher(routes, '/api/v1/sar/reports/bulk/7127836128736', 'post');
    expect(routeResult).equals(undefined);
  });
  describe('when schema has path /api/v1/sar/reports/:requestId and /api/v1/sar/reports/bulk', () => {
    const routes = {
      '/api/v1/sar/reports/:requestId': { post: 'validator-requestId' },
      '/api/v1/sar/reports/bulk': { post: 'validator-requestId' },
    };
    it('when request path is /api/v1/sar/reports/bulk - should take the exact match /api/v1/sar/reports/bulk', () => {
      const routeResult = pathMatcher(routes, '/api/v1/sar/reports/bulk', 'post');
      expect(routeResult).equals('/api/v1/sar/reports/bulk');
    });
    it('when request path is /api/v1/sar/reports/7127836128736 - should returns /api/v1/sar/reports/:requestId route', () => {
      const routeResult = pathMatcher(routes, '/api/v1/sar/reports/7127836128736', 'post');
      expect(routeResult).equals('/api/v1/sar/reports/:requestId');
    });
  });

  describe('when schema has path /api/v1/sar/reports/:requestId/:otherId and /api/v1/sar/reports/bulk/:other', () => {
    const routes = {
      '/api/v1/sar/reports/:requestId/:otherId': { post: 'validator-requestId' },
      '/api/v1/sar/reports/bulk/:other': { post: 'validator-requestId' },
    };

    it('when request path is /api/v1/sar/reports/bulk/7127836128736 - should take the match /api/v1/sar/reports/bulk/:other', () => {
      const routeResult = pathMatcher(routes, '/api/v1/sar/reports/bulk/7127836128736', 'post');
      expect(routeResult).equals('/api/v1/sar/reports/bulk/:other');
    });
    it('when request path is /api/v1/sar/reports/7127836128736/7127836128736 - should returns /api/v1/sar/reports/:requestId/:otherId route', () => {
      const routeResult = pathMatcher(routes, '/api/v1/sar/reports/7127836128736/7127836128736', 'post');
      expect(routeResult).equals('/api/v1/sar/reports/:requestId/:otherId');
    });
  });

  describe('when schema has path /i/am/:here and /i/:am/:here', () => {
    const routes = {
      '/i/am/:here': { post: 'validator-requestId' },
      '/i/:am/:here': { post: 'validator-requestId' },
    };

    it('when request path is /i/am/blblb - should match /i/am/:here', () => {
      const routeResult = pathMatcher(routes, '/i/am/blblb', 'post');
      expect(routeResult).equals('/i/am/:here');
    });
    it('when request path is /i/bbb/blblb - should match /i/:am/:here', () => {
      const routeResult = pathMatcher(routes, '/i/bbb/blbl', 'post');
      expect(routeResult).equals('/i/:am/:here');
    });
  });
  describe('when schema has path /i/:am/:here and /i/:am/here', () => {
    const routes = {
      '/i/:am/:here': { post: 'validator-requestId' },
      '/i/:am/here': { post: 'validator-requestId' },
    };
    it('when request path is /i/am/blblb - should match /i/:am/:here', () => {
      const routeResult = pathMatcher(routes, '/i/am/blblb', 'post');
      expect(routeResult).equals('/i/:am/:here');
    });
    it('when request path is /i/bbb/here - should match /i/:am/here', () => {
      const routeResult = pathMatcher(routes, '/i/bbb/here', 'post');
      expect(routeResult).equals('/i/:am/here');
    });
  });
});
