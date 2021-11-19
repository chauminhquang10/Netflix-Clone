import { TablePagination } from "@material-ui/core";

import React from "react";

export const TblPagination = ({
  records,
  page,
  pages,
  rowsPerPage,
  handleChangePage,
  handleChangeRowsPerPage,
}) => {
  return (
    <div>
      <TablePagination
        page={page}
        rowsPerPageOptions={pages}
        rowsPerPage={rowsPerPage}
        component="div"
        count={records.length}
        onChangePage={handleChangePage}
        onChangeRowsPerPage={handleChangeRowsPerPage}
      ></TablePagination>
    </div>
  );
};
