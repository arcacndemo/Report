function FetchReportData(){
FetchReportData.$inject = ['$http'];

var reportData = function ($http) {
    var response = $http({
      method: "GET",
      url: ("data.json")
    });

    return response;
	};
	return reportData;
}