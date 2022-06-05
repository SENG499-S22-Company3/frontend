import React from "react";
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent'; 
import Typography from '@material-ui/core/Typography'; 
import CardActions from '@material-ui/core/CardActions'; 
import Button from '@material-ui/core/Button'; 
import Grid from '@material-ui/core/Grid'; 
import { useNavigate } from "react-router-dom";

export const Dashboard = () => {
	const navigate = useNavigate();
	
  	return (
	    <Grid container spacing={2} justifyContent="center" alignItems="center" style={{ minHeight: '100vh' }}>
	    	<Grid item xs={2}>
			    <Card style={{ height: '25vh' }}>
			      	<CardContent>
			        	<Typography variant="h4">
			          		Survey Results
			        	</Typography>
			        	<Typography>
			          		View the results of the surveys that professors have submitted
			        	</Typography>
			      	</CardContent>
			      	<CardActions>
			        	<Button 
			        		style={{color: "#3366BB"}}
				        		onClick={() => {
	    							navigate("/surveyresults");
	  							}}
  							>
  								Go Here
  						</Button>
			      	</CardActions>
			    </Card>
		    </Grid>
		    <Grid item xs={2}>
			    <Card style={{ height: '25vh' }}>
			      	<CardContent>
			        	<Typography variant="h4">
			          		Schedule
			        	</Typography>
			        	<Typography>
			          		View class schedules
			        	</Typography>
			      	</CardContent>
			      	<CardActions>
			        	<Button 
			        		style={{color: "#3366BB"}}
				        		onClick={() => {
	    							navigate("/schedule");
	  							}}
  							>
  								Go Here
  						</Button>
			      	</CardActions>
			    </Card>
		    </Grid>
		    <Grid item xs={2}>
			    <Card style={{ height: '25vh' }}>
			      	<CardContent>
			        	<Typography variant="h4">
			          		Generate
			        	</Typography>
			        	<Typography>
			          		Generate a schedule
			        	</Typography>
			      	</CardContent>
			      	<CardActions>
			        	<Button 
			        		style={{color: "#3366BB"}}
				        		onClick={() => {
	    							navigate("/generate");
	  							}}
  							>
  								Go Here
  						</Button>
			      	</CardActions>
			    </Card>
		    </Grid>
		    <Grid item xs={2}>
			    <Card style={{ height: '25vh' }}>
			      	<CardContent>
			        	<Typography variant="h4">
			          		Profile Management
			        	</Typography>
			        	<Typography>
			          		Manage profiles of different professors
			        	</Typography>
			      	</CardContent>
			      	<CardActions>
			        	<Button 
			        		style={{color: "#3366BB"}}
				        		onClick={() => {
	    							navigate("/profileManagement");
	  							}}
  							>
  								Go Here
  						</Button>
			      	</CardActions>
			    </Card>
		    </Grid>
	    </Grid>
  	);
};

