

A simple and incomplete reservation app made with meteorjs and angular.


After deployment you should manually add assets (fruteras) to the databases using:
  - meteor mongo
    - db.fruteras.insert({ ip:"143", createdAt: new Date(), usedBy: null, since: null, until: null })
