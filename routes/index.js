module.exports = {
  getHomePage: (req, res) => {
      let query = "SELECT * FROM vendors order by id"; //query database to get all the vendors

      //  excute query
      db.query(query, (err, result) => {
          if (err) {
              res.redirect('/');
          }
         // console.log(result);
          res.render('index.ejs', {
              title: "Welcome to Vendors List | View Vendors"
              ,vendors: result
          });
      });
  },
};