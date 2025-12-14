const APIFeatures = function (query, queryString) {
    this.query = query;
    this.queryString = queryString;
  };
  
  APIFeatures.prototype.filter = function () {
    let queryObj = { ...this.queryString };
    const excludedFields = ["page", "sort", "limit", "fields"];
    excludedFields.forEach(function (el) {
      delete queryObj[el];
    });
  
    // age[gte] - 36
    // { name: 'Nebyu Samuel', age: { gte: '36' } }
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, function (match) {
      return `$${match}`;
    });
  
    queryObj = JSON.parse(queryStr);
  
    this.query = this.query.find(queryObj);
    return this;
  };
  
  APIFeatures.prototype.sort = function () {
    if (this.queryString.sort) {
      const sortObj = this.queryString.sort.split(",").join(" ");
      this.query = this.query.sort(sortObj);
    } else {
      this.query = this.query.sort("-createdAt");
    }
    return this;
  };
  
  APIFeatures.prototype.project = function () {
    if (this.queryString.fields) {
      const fieldObj = this.queryString.fields.split(",").join(" ");
      this.query = this.query.select(fieldObj);
    } else {
      this.query = this.query.select("-__v");
    }
    return this;
  };
  
  APIFeatures.prototype.paginate = function () {
    const page = this.queryString.page * 1 || 1;
    const limit = this.queryString.limit * 1 || 5;
    const skip = (page - 1) * limit;
  
    this.query = this.query.skip(skip).limit(limit);
    return this;
  };
  
  module.exports = APIFeatures;
  