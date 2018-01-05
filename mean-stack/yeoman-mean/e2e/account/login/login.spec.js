'use strict';

var config = browser.params;
var UserModel = require(config.serverConfig.root + '/server/api/user/user.model').default;

describe('Login View', function() {
  var page;

  var loadPage = function() {
    let promise = browser.get(config.baseUrl + '/login');
    page = require('./login.po');
    return promise;
  };

  var testUser = {
    name: 'Test User',
    email: 'test@example.com',
    password: 'test'
  };

  before(function() {
    return UserModel
      .remove()
      .then(function() {
        return UserModel.create(testUser);
      })
      .then(loadPage);
  });

  after(function() {
    return UserModel.remove();
  });

  it('should include login form with correct inputs and submit button', function() {
    expect(page.form.email.getAttribute('type')).to.eventually.equal('email');
    expect(page.form.email.getAttribute('name')).to.eventually.equal('email');
    expect(page.form.password.getAttribute('type')).to.eventually.equal('password');
    expect(page.form.password.getAttribute('name')).to.eventually.equal('password');
    expect(page.form.submit.getAttribute('type')).to.eventually.equal('submit');
    expect(page.form.submit.getText()).to.eventually.equal('Login');
  });

  it('should include oauth buttons with correct classes applied', function() {
    expect(page.form.oauthButtons.facebook.getText()).to.eventually.equal('Connect with Facebook');
    expect(page.form.oauthButtons.facebook.getAttribute('class')).to.eventually.contain('btn-block');
    expect(page.form.oauthButtons.google.getText()).to.eventually.equal('Connect with Google+');
    expect(page.form.oauthButtons.google.getAttribute('class')).to.eventually.contain('btn-block');
    expect(page.form.oauthButtons.twitter.getText()).to.eventually.equal('Connect with Twitter');
    expect(page.form.oauthButtons.twitter.getAttribute('class')).to.eventually.contain('btn-block');
  });

  describe('with local auth', function() {

    it('should login a user and redirecting to "/"', function() {
      return page.login(testUser).then(() => {
        var navbar = require('../../components/navbar/navbar.po');

        return browser.wait(
          () => element(by.css('.hero-unit')),
          5000,
          `Didn't find .hero-unit after 5s`
        ).then(() => {
          expect(browser.getCurrentUrl()).to.eventually.equal(config.baseUrl + '/');
          expect(navbar.navbarAccountGreeting.getText()).to.eventually.equal('Hello ' + testUser.name);
        });
      });
    });

    describe('and invalid credentials', function() {
      before(function() {
        return loadPage();
      })

      it('should indicate login failures', function() {
        page.login({
          email: testUser.email,
          password: 'badPassword'
        });

        expect(browser.getCurrentUrl()).to.eventually.equal(config.baseUrl + '/login');

        var helpBlock = page.form.element(by.css('.form-group.has-error .help-block.ng-binding'));
        expect(helpBlock.getText()).to.eventually.equal('This password is not correct.');
      });

    });

  });
});
