const should = require('should');
const setup = require('./../setup.js').createSetup();
const googleScholarHelper = require('./../../../api/helpers/googleScholarHelper.js').createGoogleScholarHelper();

describe('helpers', function() {
    describe('googleScholarHelper', function() {
        before(function(done) {
            setup.dropDB(function(err){
                done();
            });
        });
        
        after(function(done) {
            setup.dropDB(function(err){
                done();
            });
        });
        
        describe.skip('parseFile', function(){
            it('should return result for a given query', function(done) {
                this.timeout(1000000000);
                googleScholarHelper.query("Test", function(err, res){
                    res.should.be.ok();
                    done();
                });
                
            });
        });
    });
});