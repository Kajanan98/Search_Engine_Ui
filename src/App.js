import {useState, useEffect} from 'react';
import AppBar from '@mui/material/AppBar';
import Button from '@mui/material/Button';
import SearchIcon from '@mui/icons-material/SearchOutlined';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import CssBaseline from '@mui/material/CssBaseline';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Link from '@mui/material/Link';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import TextField from '@mui/material/TextField'
import I_Image from './assets/image.jpg';
import { useSearchParams } from "react-router-dom"
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import FormGroup from "@mui/material/FormGroup"
import FormControlLabel from "@mui/material/FormControlLabel"
import Checkbox from "@mui/material/Checkbox"
import TablePagination from '@mui/material/TablePagination';

function Copyright() {
	return (
		<Typography variant="body2" color="text.secondary" align="center">
			{'Copyright © '}
			<Link color="inherit" href="#">
				Search Engine 180295F
			</Link>{' '}
			{new Date().getFullYear()}
			{'.'}
		</Typography>
	);
}

const cards = [1, 2, 3, 4, 5, 6, 7, 8, 9];

const theme = createTheme();

export default function App() {
	const [results, setResults] = useState([])
	const [num_results, setNum_results] = useState({result: 0, time: 0})
    const [loading, setLoading] = useState(false)

	const [searchParams, setSearchParams] = useSearchParams()
    const [query, setQuery] = useState(searchParams.get("query") || "")
	const [sub, setSub] = useState(false)

	const handleSearchChange = (e) => {
        setQuery(e.target.value)
    }

    const handleSubmit = (e) => {
		setSub(su=>!su)
        e.preventDefault()
        setSearchParams({ query })
    }

	const [fvalue, setFvalue] = useState({
		year_order: 'asc',
		from: '1900',
		to: '2023'
	})

	const [page, setPage] = useState(0);
  	const [rowsPerPage, setRowsPerPage] = useState(5);

	const handleChangePage = (event, newPage) => {
		setPage(newPage);
	};

	const handleChangeRowsPerPage = (event) => {
		setRowsPerPage(parseInt(event.target.value));
		setPage(0);
	};
	
    useEffect(() => {
		console.log(fvalue.year_order)
        // if (!searchParams.get("query")) return
        setLoading(true)
        fetch("http://127.0.0.1:5000/search", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                query: searchParams.get("query"),
				year_order: fvalue.year_order,
				fields: Object.keys(filters).filter(k => filters[k]),
				page: page,
				page_size: rowsPerPage,
				from_year: fvalue.from==='' ? '1900' : fvalue.from,
				to_year: fvalue.to==='' ? '2023' : fvalue.to
            }),
        })
            .then((res) => res.json())
            .then((data) => {
				setNum_results({result: data.num_results, time: data.time})
                setResults(data.hits)
                setLoading(false)
            })
    }, [searchParams, fvalue.year_order, sub, rowsPerPage, page])

	const [filter, setFiletr] = useState(false)
	const handleClickAdvancedFilter = () => {
		setFiletr(val=>!val)
	}

	const [filters, setFIlters] = useState({})


    const handleChange = (e) => {
        setFIlters((filters) => {
            const _filters = { ...filters }
            _filters[e.target.name] = e.target.checked
            return _filters
        })
    }
	

	return (
		<ThemeProvider theme={theme}>
			<form onSubmit={handleSubmit}>
			<CssBaseline />
			<AppBar position="relative">
				<Toolbar>
					<SearchIcon sx={{ mr: 2 }} />
					<Typography variant="h6" color="inherit" noWrap>
						180295F - Search Engine
					</Typography>
				</Toolbar>
			</AppBar>
			<main >
				<Box
					sx={{
						bgcolor: 'background.paper',
						pt: 8,
						pb: 6,
						
					}}
				>
					<Container maxWidth="md">
						<Typography
							component="h1"
							variant="h2"
							align="center"
							color="text.primary"
							gutterBottom
						>
							Search Engine
						</Typography>
						<Typography variant="h5" align="center" color="text.secondary" paragraph>
							In here you can find the songs using keywords.
						</Typography>
						{/* <Stack
							sx={{ pb: 4 }}
							direction="row"
							spacing={2}
							justifyContent="center"
							fullwidth
						>
							<Button variant="contained">All</Button>
							<Button variant="outlined">Year</Button>
						</Stack> */}
						<Stack container spacing={4} >
							<Grid container spacing={2}>
								<Grid item xs={10} >
									<Box sx={{display: 'flex', flexDirection: 'column'}}>
										<TextField 
											id="outlined-basic" 
											label="Search here..." 
											fullwidth 
											size='medium' 
											variant="outlined" 
											onChange={handleSearchChange}
										/>
									</Box>
									
								</Grid>
								<Grid item>
									<Button 
										variant="contained"
										sx={{height: '100%'}}
										type='submit'
									>
										<SearchIcon />
									</Button>
								</Grid>
							</Grid>
						</Stack>
						<Button sx={{mt: 2}} variant={filter ? "contained" : "outlined"} onClick={handleClickAdvancedFilter}>Advanced Filters</Button>
						{
							filter && 
							<Card sx={{mt: 2, p: 2}}>
								<Button variant="outlined" onClick={()=>{setFvalue(val=>({...val, year_order: val['year_order']==='asc'? 'desc' : 'asc'}))}}>Year - {fvalue.year_order==='asc' ? 'ASC' : 'DESC'}</Button>
								
								<FormGroup row={true}>
									{/* <FormControlLabel
										control={
											<Checkbox
												checked={!!filters.all}
												name="all"
												onChange={handleChange}
											/>
										}
										label="All"
									/> */}
									<FormControlLabel
										control={
											<Checkbox
												checked={!!filters.year}
												name="year"
												onChange={handleChange}
											/>
										}
										label="Year"
									/>
									<FormControlLabel
										control={
											<Checkbox
												checked={!!filters.album}
												name="album"
												onChange={handleChange}
											/>
										}
										label="Album"
									/>
									<FormControlLabel
										control={
											<Checkbox
												checked={!!filters.lyrics}
												name="lyrics"
												onChange={handleChange}
											/>
										}
										label="Lyrics"
									/>
									<FormControlLabel
										control={
											<Checkbox
												checked={!!filters.lyricist}
												name="lyricist"
												onChange={handleChange}
											/>
										}
										label="Lyricist"
									/>
									<FormControlLabel
										control={
											<Checkbox
												checked={!!filters.singers}
												name="singers"
												onChange={handleChange}
											/>
										}
										label="Singers"
									/>
									<FormControlLabel
										control={
											<Checkbox
												checked={!!filters.composer}
												name="composer"
												onChange={handleChange}
											/>
										}
										label="Composer"
									/>
								</FormGroup>
								<Box sx={{display: 'flex', flexDirection: 'row'}}>
									<TextField 
										id="outlined-basic" 
										label="From" 
										fullwidth 
										size='small' 
										variant="outlined" 
										sx={{mr: 2}}
										onChange={(e)=>{setFvalue((val=>({...val, from: (e.target.value)})))}}
									/>
									<TextField 
										id="outlined-basic" 
										label="To" 
										fullwidth 
										size='small' 
										variant="outlined"
										sx={{mr: 2}} 
										onChange={(e)=>{setFvalue((val=>({...val, to: (e.target.value)})))}}

									/>
									<Button 
										variant="contained"
										sx={{height: '100%'}}
										type='submit'
									>
										<SearchIcon />
									</Button>
								</Box>
							</Card>

						}
					</Container>
				</Box>
				{ loading && 
					<Backdrop
						sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
						open={loading}
						// onClick={handleClose}
					>
						<CircularProgress color="inherit" />
					</Backdrop>
				}
				<Card sx={{ py: 2, m: 2, p: 2 }} maxWidth="md">
					<Typography variant="body" align="start" color="text.secondary" paragraph>
						About {num_results.result} results ({num_results.time/1000} seconds) 
					</Typography>
					<Grid container spacing={4}>
						{results?.map(({_source: {album, composer, lyricist, lyrics, metaphors, singers, year}, _id}) => (
							<Grid item key={_id} xs={12} sm={12} md={6}>
								<Card
									sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}
								>
									{/* <CardMedia
										component="img"
										sx={{
										// 16:9
										// pt: '56.25%',
										}}
										image={`${I_Image}`}
										// alt="random"
									/> */}
									<CardContent sx={{ flexGrow: 1 }}>
										<Typography gutterBottom variant="h5" component="h2">
											{album}
										</Typography>
										<Button size="small">Year: {year}</Button><br/>
										<Button size="small">Lyricist: {lyricist}</Button><br/>
									
										<Button size="small">Composer: {composer}</Button><br/>
										<Button size="small">Singers: {singers}</Button><br/>
										<h3>Metaphors</h3>
										{
											metaphors.map(({source, target,interpretation, metaphor}, id)=>(
												
												<div key={source+target}>
													<h5>Metaphor: {id+1}</h5>
													<Typography>
														Metaphor :{metaphor}
													</Typography>
													<Typography>
														source :{source}
													</Typography>
													<Typography>
														Target :{target}
													</Typography>
													<Typography>
														Interpretation :{interpretation}
													</Typography>
												</div>
											))
										}
										<h3>Lyrics</h3>
										<Typography>
											{lyrics}
										</Typography>
										
									</CardContent>
									
										
									<CardActions>
									</CardActions>
								</Card>
							</Grid>
						))}
					</Grid>
					<TablePagination
						component="div"
						count={num_results.result}
						page={page}
						onPageChange={handleChangePage}
						rowsPerPage={rowsPerPage}
						onRowsPerPageChange={handleChangeRowsPerPage}
						rowsPerPageOptions={[5, 10, 25, 50, 100]}
					/>
				</Card>
			</main>
			<Box sx={{ bgcolor: 'background.paper', p: 6 }} component="footer">
				<Copyright />
			</Box>
			</form>
		</ThemeProvider>
	);
}