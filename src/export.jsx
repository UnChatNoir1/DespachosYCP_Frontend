import React, { useCallback, useEffect, useState } from "react";
import { read, utils, writeFileXLSX } from 'xlsx';

export default function SheetJSReactAoO() {

  const [pres, setPres] = useState([]);

  useEffect(() => { (async() => {
    const data = await (await fetch("https://Tarea1Backend.dieterpreuss.repl.co/api/pasturas"));
    /*const wb = read(f); // parse the array buffer
    const ws = wb.Sheets[wb.SheetNames[0]]; // get the first worksheet
    const data = utils.sheet_to_json(ws);*/ // generate objects
    setPres(data); // update state
  })(); }, []);

  /* get state data and export to XLSX */
  const exportFile = useCallback(() => {
    const ws = utils.json_to_sheet(pres);
    const wb = utils.book_new();
    utils.book_append_sheet(wb, ws, "Data");
    writeFileXLSX(wb, "SheetJSReactAoO.xlsx");
  }, [pres]);

   return (<table><thead><th>Name</th><th>Index</th></thead><tbody>
    { /* generate row for each president */
      pres.map(pres => (<tr>
        <td>{pres.Name}</td>
        <td>{pres.Index}</td>
      </tr>))
    }
  </tbody><tfoot><td colSpan={2}>
    <button onClick={exportFile}>Export XLSX</button>
  </td></tfoot></table>);                     

}

