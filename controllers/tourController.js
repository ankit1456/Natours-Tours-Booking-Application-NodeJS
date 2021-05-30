const fs = require('fs');

const tours = JSON.parse(fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`, 'utf-8'));
exports.getAllTours = (req, res) => {
  res.status(200).json({
    status: 'success',
    requestedAt: req.requestTime,
    results: tours.length,
    data: {
      tours
    }
  });
};
exports.getTour = (req, res) => {
  const tour = tours.find(el => el.id === req.params.id * 1);

  if (!tour) {
    return res.status(404).json({
      status: 'success',
      message: 'Invalid id'
    });
  }
  res.status(200).json({
    status: 'success',
    data: {
      tour
    }
  });
};

exports.createTour = (req, res) => {
  const newID = tours[tours.length - 1].id + 1;

  const newTour = { id: newID, ...req.body };

  tours.push(newTour);
  fs.writeFile(`${__dirname}/dev-data/data/tours-simple.json`, JSON.stringify(tours), err => {
    res.status(201).json({
      status: 'success',
      data: {
        tour: newTour
      }
    });
  });
};

exports.updateTour = (req, res) => {
  const tour = tours.find(el => el.id === req.params.id * 1);

  if (!tour) {
    return res.status(404).json({
      status: 'success',
      message: 'Invalid id'
    });
  }
  res.status(200).json({
    status: 'success',
    data: {
      tour: '<h1>UPDATED TOUR</h1>'
    }
  });
};

exports.deleteTour = (req, res) => {
  const tour = tours.find(el => el.id === req.params.id * 1);

  if (!tour) {
    return res.status(404).json({
      status: 'success',
      message: 'Invalid id'
    });
  }
  res.status(204).json({
    status: 'success',
    data: null
  });
};
