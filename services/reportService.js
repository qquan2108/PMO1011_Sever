async function getRevenueReports() {
    const reports = await Report.find();
    return reports;
  }
  
  async function getServiceSpecificReports() {
    const serviceReports = await Report.find({ type: "service" });
    return serviceReports;
  }
  
  module.exports = {
    getRevenueReports,
    getServiceSpecificReports
  };