export default defineNuxtPlugin(() => {
  const JSONToCSVConvertor = (JSONData, ReportTitle, ShowLabel) => {
    let arrData =
      typeof JSONData != "object" ? JSON.parse(JSONData) : JSONData;

    let CSV = "\r\n";

    if (ShowLabel) {
      let row = "";
      for (const index in arrData[0]) {
        row += index + ",";
      }
      row = row.slice(0, -1);
      CSV += row + "\r\n";
    }

    for (let i = 0; i < arrData.length; i++) {
      let row = "";
      for (const index in arrData[i]) {
        row += `"${arrData[i][index]}",`;
      }
      CSV += row + "\r\n";
    }

    if (!CSV) {
      alert("Invalid data");
      return;
    }

    let fileName = "WSReport_" + ReportTitle.replace(/ /g, "_");
    let uri = "data:text/csv;charset=utf-8," + escape(CSV);

    let link = document.createElement("a");
    link.href = uri;
    link.style.visibility = "hidden";
    link.download = fileName + ".csv";

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return {
    provide: {
      JSONToCSVConvertor,
    },
  };
});
