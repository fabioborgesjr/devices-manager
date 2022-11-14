import React, { useState, useEffect, useCallback } from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import { visuallyHidden } from '@mui/utils'
import Box from '@mui/material/Box'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell, { tableCellClasses } from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TablePagination from '@mui/material/TablePagination'
import TableRow from '@mui/material/TableRow'
import TableSortLabel from '@mui/material/TableSortLabel'
import Typography from '@mui/material/Typography'
import Paper from '@mui/material/Paper'
import Checkbox from '@mui/material/Checkbox'
import { Button, Skeleton, Tooltip, useMediaQuery } from '@mui/material'
import { Add, Delete, Edit } from '@mui/icons-material'
import { useDeleteDevice } from '../../hooks'
import { styled } from '@mui/material/styles'

function descendingComparator(a, b, orderBy) {
  const isNumber = orderBy === 'hdd_capacity'
  const bValue = isNumber ? parseInt(b[orderBy], 10) : b[orderBy].toLowerCase()
  const aValue = isNumber ? parseInt(a[orderBy], 10) : a[orderBy].toLowerCase()

  if (bValue < aValue) {
    return -1
  }
  if (bValue > aValue) {
    return 1
  }
  return 0
}

function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy)
}

const getSkeletonRows = (rowsLength) => {
  const skeletonArray = []

  for (let i = 0; i < rowsLength; i++) {
    skeletonArray.push(
      <StyledTableRow
        hover
        role='checkbox'
        aria-checked={false}
        tabIndex={-1}
        key={i}
        selected={false}
      >
        <StyledTableCell padding='checkbox'>
          <Checkbox color='primary' checked={false} disabled />
        </StyledTableCell>
        <StyledTableCell>
          <Skeleton />
        </StyledTableCell>
        <StyledTableCell>
          <Skeleton />
        </StyledTableCell>
        <StyledTableCell>
          <Skeleton />
        </StyledTableCell>
        <StyledTableCell>
          <Skeleton />
        </StyledTableCell>
      </StyledTableRow>,
    )
  }

  return skeletonArray
}

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    color: theme.palette.common.black,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}))

const StyledTableRow = styled(TableRow)(() => ({
  cursor: 'pointer',
}))

function EnhancedTableHead({
  headCells,
  onSelectAllClick,
  order,
  orderBy,
  numSelected,
  rowCount,
  onRequestSort,
  isLoading,
}) {
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property)
  }

  return (
    <TableHead>
      <StyledTableRow>
        <StyledTableCell padding='checkbox'>
          <Checkbox
            color='primary'
            indeterminate={numSelected > 0 && numSelected < rowCount}
            checked={rowCount > 0 && numSelected === rowCount}
            onChange={onSelectAllClick}
            inputProps={{
              'aria-label': 'select all desserts',
            }}
            disabled={isLoading}
          />
        </StyledTableCell>
        {headCells.map((headCell) => (
          <StyledTableCell
            key={headCell.id}
            align='center'
            padding={headCell.disablePadding ? 'none' : 'normal'}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : 'asc'}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <Box component='span' sx={visuallyHidden}>
                  {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                </Box>
              ) : null}
            </TableSortLabel>
          </StyledTableCell>
        ))}
      </StyledTableRow>
    </TableHead>
  )
}

EnhancedTableHead.propTypes = {
  numSelected: PropTypes.number.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  onSelectAllClick: PropTypes.func.isRequired,
  order: PropTypes.oneOf(['asc', 'desc']).isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired,
  headCells: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      numeric: PropTypes.bool.isRequired,
      disablePadding: PropTypes.bool.isRequired,
      label: PropTypes.string.isRequired,
      align: PropTypes.string.isRequired,
    }),
  ).isRequired,
  isLoading: PropTypes.bool,
}

function HeaderActions({ selected, refetch, showDeletedSnackbar, isLoading }) {
  const { mutation } = useDeleteDevice()
  const selectedLength = selected.length

  const handleDevicesDelete = useCallback(() => {
    Promise.all(selected.map((device) => mutation.mutate(device))).then(() => {
      refetch(selected)
      showDeletedSnackbar && showDeletedSnackbar()
    })
  }, [selected, refetch, showDeletedSnackbar])

  return (
    <Box sx={{ display: 'flex' }}>
      {selectedLength > 0 ? (
        <>
          {selectedLength === 1 ? (
            <Tooltip title='Edit device'>
              <span>
                <Button
                  variant='contained'
                  startIcon={<Edit />}
                  component={Link}
                  to={`edit/${selected[0]}`}
                  sx={{ color: '#fff' }}
                  disabled={isLoading}
                >
                  Edit
                </Button>
              </span>
            </Tooltip>
          ) : null}
          <Tooltip title='Delete device'>
            <span>
              <Button
                variant='contained'
                startIcon={<Delete />}
                onClick={handleDevicesDelete}
                sx={{ ml: 1, color: '#fff' }}
                disabled={isLoading}
              >
                Delete
              </Button>
            </span>
          </Tooltip>
        </>
      ) : (
        <Tooltip title='Add device'>
          <span>
            <Button
              variant='contained'
              startIcon={<Add />}
              component={Link}
              to='add'
              sx={{ color: '#fff' }}
              disabled={isLoading}
            >
              Add
            </Button>
          </span>
        </Tooltip>
      )}
    </Box>
  )
}

HeaderActions.propTypes = {
  selected: [],
}

HeaderActions.propTypes = {
  selected: PropTypes.arrayOf(PropTypes.string).isRequired,
  refetch: PropTypes.func.isRequired,
  showDeletedSnackbar: PropTypes.func,
  isLoading: PropTypes.bool,
}

function EnhancedTableToolbar({ numSelected, children }) {
  const isMobile = useMediaQuery('(max-width:500px)')

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: isMobile && numSelected === 1 ? 'left' : 'center',
        p: 1,
        flexDirection: isMobile && numSelected === 1 ? 'column' : 'row',
        backgroundColor: 'primary.main',
        color: '#fff',
      }}
    >
      {numSelected > 1 ? (
        <Typography sx={{ flex: '1 1 100%', ml: 1 }} variant='subtitle1' component='div'>
          {numSelected} selected
        </Typography>
      ) : (
        <Typography sx={{ flex: '1 1 100%', ml: 1 }} variant='h6' id='tableTitle' component='div'>
          Devices List
        </Typography>
      )}
      {children}
    </Box>
  )
}

EnhancedTableToolbar.propTypes = {
  numSelected: PropTypes.number.isRequired,
  children: PropTypes.node.isRequired,
}

function EnhancedTable({ data, headCells, deviceSort, refetch, showDeletedSnackbar, isLoading }) {
  const [order, setOrder] = useState('asc')
  const [orderBy, setOrderBy] = useState(deviceSort)
  const [selected, setSelected] = useState([])
  const [page, setPage] = useState(0)
  const [rows, setRows] = useState(data)
  const [rowsPerPage, setRowsPerPage] = useState(5)

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc'

    setOrder(isAsc ? 'desc' : 'asc')
    setOrderBy(property)
  }

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelected = rows.map((n) => n.id)
      setSelected(newSelected)
      return
    }
    setSelected([])
  }

  const handleClick = (event, id) => {
    const selectedIndex = selected.indexOf(id)
    let newSelected = []

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id)
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1))
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1))
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1),
      )
    }

    setSelected(newSelected)
  }

  const handleChangePage = (event, newPage) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10))
    setPage(0)
  }

  const isSelected = (id) => selected.indexOf(id) !== -1

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0

  useEffect(() => {
    if (deviceSort) {
      handleRequestSort(null, deviceSort.toLowerCase())
    }
  }, [deviceSort])

  useEffect(() => {
    if (selected.length) {
      setSelected([])
    } 
    
    if (page !== 0) {
      setPage(0)
    }

    setRows(data)
  }, [data])

  return (
    <Box sx={{ width: '100%' }}>
      <Paper sx={{ width: '100%' }} elevation={0}>
        <EnhancedTableToolbar numSelected={selected.length}>
          <HeaderActions
            selected={selected}
            refetch={refetch}
            showDeletedSnackbar={showDeletedSnackbar}
            isLoading={isLoading}
          />
        </EnhancedTableToolbar>
        <TableContainer>
          <Table sx={{ minWidth: 750 }} aria-labelledby='tableTitle' size='medium'>
            <EnhancedTableHead
              numSelected={selected.length}
              order={order}
              orderBy={orderBy}
              onSelectAllClick={handleSelectAllClick}
              onRequestSort={handleRequestSort}
              rowCount={rows.length}
              headCells={headCells}
              isLoading={isLoading}
            />
            <TableBody>
              {rows.length
                ? rows
                    .sort(getComparator(order, orderBy))
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row, index) => {
                      const isItemSelected = isSelected(row.id)
                      const labelId = `enhanced-table-checkbox-${index}`

                      return (
                        <StyledTableRow
                          hover
                          onClick={(event) => handleClick(event, row.id)}
                          role='checkbox'
                          aria-checked={isItemSelected}
                          tabIndex={-1}
                          key={row.id}
                          selected={isItemSelected}
                        >
                          <StyledTableCell padding='checkbox'>
                            <Checkbox
                              color='primary'
                              checked={isItemSelected}
                              inputProps={{
                                'aria-labelledby': labelId,
                              }}
                            />
                          </StyledTableCell>
                          {headCells.map((header) => (
                            <StyledTableCell key={header.id} align={header.align}>
                              {header.formatter ? header.formatter(row[header.id]) : row[header.id]}
                            </StyledTableCell>
                          ))}
                        </StyledTableRow>
                      )
                    })
                : isLoading
                ? getSkeletonRows(rowsPerPage)
                : null}
              {emptyRows > 0 && (
                <StyledTableRow
                  style={{
                    height: 53 * emptyRows,
                  }}
                >
                  <StyledTableCell colSpan={6} />
                </StyledTableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        {rows && (
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component='div'
            count={rows.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        )}
      </Paper>
    </Box>
  )
}

EnhancedTable.propTypes = {
  headCells: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      numeric: PropTypes.bool.isRequired,
      disablePadding: PropTypes.bool.isRequired,
      label: PropTypes.string.isRequired,
      align: PropTypes.string.isRequired,
    }),
  ).isRequired,
  data: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      hdd_capacity: PropTypes.string.isRequired,
      system_name: PropTypes.string.isRequired,
      type: PropTypes.string.isRequired,
    }),
  ),
  deviceSort: PropTypes.string,
  refetch: PropTypes.func.isRequired,
  showDeletedSnackbar: PropTypes.func,
  isLoading: PropTypes.bool,
}

EnhancedTable.defaultProps = {
  data: [],
  deviceSort: null,
}

export default EnhancedTable
