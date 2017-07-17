var HomeController = {
  handleHome: function() {
    console.log('handling home');
  }
};

var MediaController = {
  handleMediaId: function(id) {
    // document.getElementById('number').innerHTML = '5';
    console.log('id: ' +  JSON.stringify(id));
  },

  handleMediaId2: function(stuff) {
    // document.getElementById('number').innerHTML = '6';
    console.log('stuff: ' + JSON.stringify(stuff));
  }
}


var routes = {
  'home': HomeController.handleHome,
  'media/:id': MediaController.handleMediaId,
  'media/:id/:path': MediaController.handleMediaId2
};

var router = new IVRouter.default(routes);

// router.navigateTo('media/1234/asdfs');
