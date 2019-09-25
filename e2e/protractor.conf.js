// Protractor configuration file, see link for more information
// https://github.com/angular/protractor/blob/master/lib/config.ts

const { SpecReporter } = require('jasmine-spec-reporter');

exports.config = {
  allScriptsTimeout: 11000,
  specs: ['./src/**/*.e2e-spec.ts'],
  multiCapabilities: [
    {
      browserName: 'chrome',
      chromeOptions: {
        mobileEmulation: {
          name: 'Samsung Galaxy S8+',
          deviceMetrics: {
            width: 360,
            height: 720,
            pixelRatio: 4.0,
          },
        },
        args: [
          '--lang=fr',
          '--headless',
          '--user-agent=Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/75.0.3770.142 Safari/537.36',
        ],
      },
    },
    {
      browserName: 'chrome',
      chromeOptions: {
        mobileEmulation: {
          name: 'Samsung Galaxy Tab 10',
          deviceMetrics: {
            width: 800,
            height: 1280,
            pixelRatio: 1.0,
          },
        },
        args: [
          '--lang=fr',
          '--headless',
          '--user-agent=Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/75.0.3770.142 Safari/537.36',
        ],
      },
    },
  ],
  directConnect: true,
  baseUrl: 'http://localhost:4200/',
  framework: 'jasmine',
  jasmineNodeOpts: {
    showColors: true,
    defaultTimeoutInterval: 30000,
    print: function() {},
  },
  onPrepare() {
    require('ts-node').register({
      project: 'e2e/tsconfig.e2e.json',
    });
    jasmine.getEnv().addReporter(new SpecReporter({ spec: { displayStacktrace: true } }));
  },
};
