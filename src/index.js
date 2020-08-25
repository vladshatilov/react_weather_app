import React,{Component} from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import * as serviceWorker from './serviceWorker';
import Geolocation from '@react-native-community/geolocation';
import "bootswatch/dist/litera/bootstrap.css";
import Loader from './Loader/Loader.js';
import { Navbar, NavItem, Nav, Container , Row, Col } from "react-bootstrap";



const PLACES = [
	{ name: "My location", zip: "0"},
	{ name: "Cheboksary", zip: "569696" },
	{ name: "New York", zip: "94088" },
	{ name: "Hong Kong", zip: "95062" },
	{ name: "Doha", zip: "95062" },
	{ name: "Moscow", zip: "95062" },
	{ name: "Sydney", zip: "96803" }
];


class App extends React.Component {
	
	constructor(props){
		super(props)
		this.state = {
			'activePlace': 'Moscow',
			'weather': {},
			'units': 'metric'
		}
		Geolocation.getCurrentPosition(info => console.log(info));
	}
	
	componentDidMount(){		
		// navigator.geolocation = require('@react-native-community/geolocation');
		this.getLocationAndWeather();
	}
	
	getLocationAndWeather() {
		if ("geolocation" in navigator) {			
			navigator.geolocation.getCurrentPosition( (position) => {
				let latitude = position.coords.latitude
				let longitude = position.coords.longitude
				let units = this.state.units;

				let location = (this.state.activePlace === "My location"
									?	`lat=${latitude}&lon=${longitude}`
									: `q=${this.state.activePlace}`)
				let url = `http://api.openweathermap.org/data/2.5/weather?${location}&appid=f8cfda0ca4b8ccfef50bf143d6133107&units=${units}`;
				let fetchJsonp = require("fetch-jsonp");
				fetchJsonp(url).then( (response) => response.json().then( (json) => {this.setState({weather: json, activePlace: json.name});} ) )
				// console.log(this.state.weather);
			},
			(error) =>
				{
					let units = this.state.units;
					let location = `q=${this.state.activePlace}`;
					let url = `http://api.openweathermap.org/data/2.5/weather?${location}&appid=f8cfda0ca4b8ccfef50bf143d6133107&units=${units}`;
					let fetchJsonp = require("fetch-jsonp");
					fetchJsonp(url).then( (response) => response.json().then( (json) => {this.setState({weather: json, activePlace: json.name});} ) )
					// если ошибка (можно проверить код ошибки)
					if(error.PERMISSION_DENIED)
					{
						// console.log("В доступе отказано!");
					}
				}
			)
		}
		else {
			let units = this.state.units;
			let location = `q=${this.state.activePlace}`;
			let url = `http://api.openweathermap.org/data/2.5/weather?${location}&appid=f8cfda0ca4b8ccfef50bf143d6133107&units=${units}`;
			let fetchJsonp = require("fetch-jsonp");
			fetchJsonp(url).then( (response) => response.json().then( (json) => {this.setState({weather: json, activePlace: json.name});console.log(json.name);} ) )
		}
	}
	
	onDegClick(){
		this.state.units == 'metric'
			? this.setState({units: 'imperial'})
			: this.setState({units: 'metric'});
		this.getLocationAndWeather();
		console.log('Clicked!');
	}


	onCityClick = (e, name) => {
		if (name !== 'My location') { 
			document.getElementById('subtitleHandler').style.visibility='hidden';
		}
		this.setState({
			activePlace : name
		}, () => {
			// console.log(this.state.activePlace);
			// console.log(this.state.activePlace === "Sydney");
			
			this.getLocationAndWeather();
			let video = document.getElementById('video_background');
			video.load();
			});
		// console.log(name);
	}
	
	render(){
		
		let title = 'Weather App'
		let subtitle = 'The weather outside your window...'
		if (!this.state.weather.weather) return <Loader />;
		// const iconUrl = "http://openweathermap.org/img/w/" + weather.icon + ".png";

		let iconUrl = this.state.weather.weather && this.state.weather.weather[0].icon
			? `http://openweathermap.org/img/w/${this.state.weather.weather[0].icon}.png`
			: ''
		
		let deg = this.state.weather.main && this.state.weather.main.temp 
			? this.state.weather.main.temp 
			: ''
		
		let summary = this.state.weather.weather && this.state.weather.weather[0].main
			? this.state.weather.weather[0].main
			: ''

		let altIcon = this.state.weather.weather && this.state.weather.weather[0].description
			? this.state.weather.weather[0].description
			: ''
		const windSpeed = this.state.weather.wind
			? this.state.weather.wind.speed
			: ''
		const activePlace = this.state.activePlace;
		const feels_like = Math.round(this.state.weather.main.feels_like);

		return (
			<div className='app'>
				<nav className="navbar navbar-expand-lg navbar-dark bg-primary" >
					<a className="navbar-brand" href="#">{title}</a>				
				</nav>

				
					<VideoHandler weatherCondHandle={summary} />
				

				<div className="wrapper">
					<Container>
					 <Row>
							<Col md={4} sm={4}>
								<div className='selectHandler'>Select city:</div>
								<Nav
									bsStyle="pills"
										stacked="true"
									activeKey={activePlace}
									onSelect={index => {
										this.setState({ activePlace: index });
									}}
								>
								<div className="btn-group-vertical">
									{PLACES.map((place, index) => (
										
										<button key ={index} type="button" className="btn btn-primary" onClick = {e => this.onCityClick(e, place.name)} >{place.name}</button>
									))}
								 </div>
								</Nav>
							</Col>

							<Col md={8} sm={8}>
								<div className='subtitle' id='subtitleHandler'><i>{subtitle}</i></div>
								<div className='infopanel'>
									<div className='infopanelTemp'>
										<div className='summary'><strong>{summary} in {this.state.activePlace}</strong>
										<img className='picWithTemp' src={iconUrl} alt={altIcon} /></div>
										<div className='flex-row pointer' onClick={this.onDegClick.bind(this)}>Current: {deg}°{this.state.units=='metric' ? 'C':'F' }
										</div> 
										<div className='flex-row pointer' onClick={this.onDegClick.bind(this)}>Feels like: {feels_like}°{this.state.units=='metric' ? 'C':'F' } </div>
									</div>
									<div onClick={this.onDegClick.bind(this)} >Wind Speed: {windSpeed} {this.state.units =='metric' ? 'meter/sec':'miles/hour'}</div>
									
								</div>
							</Col>
						</Row>
					</Container>
				</div>			

			</div>		
		)
		
	}	
	
}



function VideoHandler(props){
			const weatherCondition = {'Thunderstorm':["https://cdn.flixel.com/flixel/13e0s6coh6ayapvdyqnv.hd"
							  , "https://cdn.flixel.com/flixel/aorl3skmssy7udwopk22.hd"
							  , "https://cdn.flixel.com/flixel/qed6wvf2igukiioykg3r.hd"
							  , "https://cdn.flixel.com/flixel/3rd72eezaj6d23ahlo7y.hd"
							  , "https://cdn.flixel.com/flixel/9m11gd43m6qn3y93ntzp.hd"
							  , "https://cdn.flixel.com/flixel/hrkw2m8eofib9sk7t1v2.hd"],
						'Drizzle':["https://cdn.flixel.com/flixel/vwqzlk4turo2449be9uf.hd"
							  , "https://cdn.flixel.com/flixel/5363uhabodwwrzgnq6vx.hd"],
						'Rain':["https://cdn.flixel.com/flixel/f0w23bd0enxur5ff0bxz.hd"],
						'Snow':["https://cdn.flixel.com/flixel/x9dr8caygivq5secll7i.hd"
							  , "https://cdn.flixel.com/flixel/v26zyfd6yf0r33s46vpe.hd"
							  , "https://cdn.flixel.com/flixel/ypy8bw9fgw1zv2b4htp2.hd"
							  , "https://cdn.flixel.com/flixel/rosz2gi676xhkiw1ut6i.hd"
						],
						'Clear':["https://cdn.flixel.com/flixel/hlhff0h8md4ev0kju5be.hd"
							  , "https://cdn.flixel.com/flixel/zjqsoc6ecqhntpl5vacs.hd"
							  , "https://cdn.flixel.com/flixel/jvw1avupguhfbo11betq.hd"
							  , "https://cdn.flixel.com/flixel/8cmeusxf3pkanai43djs.hd"
							  , "https://cdn.flixel.com/flixel/guwb10mfddctfvwioaex.hd"],
						'Clouds':["https://cdn.flixel.com/flixel/e95h5cqyvhnrk4ytqt4q.hd"
							  , "https://cdn.flixel.com/flixel/l2bjw34wnusyf5q2qq3p.hd"
							  , "https://cdn.flixel.com/flixel/rrgta099ulami3zb9fd2.hd"
							  , "https://cdn.flixel.com/flixel/13e0s6coh6ayapvdyqnv.hd"
							  , "https://cdn.flixel.com/flixel/aorl3skmssy7udwopk22.hd"
							  , "https://cdn.flixel.com/flixel/qed6wvf2igukiioykg3r.hd"
							  , "https://cdn.flixel.com/flixel/3rd72eezaj6d23ahlo7y.hd"
							  , "https://cdn.flixel.com/flixel/9m11gd43m6qn3y93ntzp.hd"
							  , "https://cdn.flixel.com/flixel/hrkw2m8eofib9sk7t1v2.hd"]};

							 let bacgroundVideoHandle = '';
			if (props.weatherCondHandle in weatherCondition){
				bacgroundVideoHandle = weatherCondition[props.weatherCondHandle][Math.floor(Math.random() * (weatherCondition[props.weatherCondHandle].length ))]
				console.log(bacgroundVideoHandle);
			}
			else {
				bacgroundVideoHandle = 'https://cdn.flixel.com/flixel/ypy8bw9fgw1zv2b4htp2.hd';
			}

			let mp4Name = `${bacgroundVideoHandle}.mp4`;
			let webmName = `${bacgroundVideoHandle}.webm`;
			let ogvName = `${bacgroundVideoHandle}.ogv`;

			
		return (	<div className="fullscreen-bg"> 
								<video id='video_background' loop muted autoPlay poster="img/videoframe.jpg" className="fullscreen-bg__video"> 										
									<source src={mp4Name} type="video/webm" /> 
									<source src={webmName} type="video/webm"/>
									<source src={ogvName} type="video/ogg"/>
									<p>Your browser does not support the video element. Try this page in a modern browser!</p>
								</video> 
			</div> 
		)
	
}






class Footer extends React.Component {
	render(){ 
		let footerText = ' Created by '
		return <div className='footer-content'>Click on unit name to change Metric/Imperial system of units. 
			{footerText}
			<a href='https://www.facebook.com/shatilovvlad/' target='_blank'> Vlad Shatilov</a>
			<div id="footer-logo">
							<a href="/"></a>
							<p>Weather app © 2020 . A <a href="https://github.com/vladshatilov">Vlad Shatilov</a> creation</p>
						</div>
		</div>
	}
}

ReactDOM.render(<App/>, document.getElementById('app'));
ReactDOM.render(<Footer/>, document.getElementById('footer'));
