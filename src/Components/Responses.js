import React from 'react';
import { Box } from '@mui/material';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';

/**
 * Columns in responses table.
 */
const columns = [
    {
      field: 'id',
      headerName: 'ID',
      width: 70
    },
    {
      field: 'user',
      headerName: 'User',
      width: 150,
      renderCell: (cellValues) => {
        return (
          <div>
            {cellValues.value}
          </div>
        );
      }
    },
    {
        field: 'time',
        headerName: 'Timestamp',
        width: 200,
        renderCell: (cellValues) => {
          return (
            <div>
              {cellValues.value}
            </div>
          );
        }
    },
    {
        field: 'answer',
        headerName: 'Answer',
        width: 150,
        renderCell: (cellValues) => {
          return (
            <div>
              {cellValues.value}
            </div>
          );
        }
    },
    {
        field: 'confidence',
        headerName: 'Confidence Level',
        width: 170,
        renderCell: (cellValues) => {
          return (
            <div>
              {cellValues.value}
            </div>
          );
        }
    },
    {
        field: 'question',
        headerName: 'Question',
        width: 250,
        renderCell: (cellValues) => {
          return (
            <div>
              {cellValues.value}
            </div>
          );
        }
    },
    {
      field: 'score',
      headerName: 'Score',
      width: 150,
      renderCell: (cellValues) => {
        return (
          <div>
            {cellValues.value}
          </div>
        );
      }
  },
  ];

/**
 * Table for all responses from session.
 * 
 * @param {*} param0 
 * @returns responses table
 */
export default function Responses( { data } ) {
  return (
    <Box display='grid' justifyContent='center' height={500}>
        <DataGrid
        columns={columns}
        rows={data}
        slots={{
        toolbar: GridToolbar,
        }}/>
    </Box>
  );
}