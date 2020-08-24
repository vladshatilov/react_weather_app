import React,{Component} from 'react';
import ReactDOM from 'react-dom';
import './index.css';
// import App from './App';
import * as serviceWorker from './serviceWorker';
import Geolocation from '@react-native-community/geolocation';
import "bootswatch/dist/litera/bootstrap.css";
import Loader from './Loader/Loader.js';
import { Navbar, NavItem, Nav, Container , Row, Col } from "react-bootstrap";
// ReactDOM.render(
//	 <React.StrictMode>
//		 <App />
//	 </React.StrictMode>,
//	 document.getElementById('root')
// );

// // If you want your app to work offline and load faster, you can change
// // unregister() to register() below. Note this comes with some pitfalls.
// // Learn more about service workers: https://bit.ly/CRA-PWA
// serviceWorker.unregister();


const PLACES = [
	{ name: "My location", zip: "0"},
	{ name: "Cheboksary", zip: "569696" },
	{ name: "New York", zip: "94088" },
	{ name: "Hong Kong", zip: "95062" },
	{ name: "Doha", zip: "95062" },
	{ name: "Yakutsk", zip: "95062" },
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
		// jQuery(function(){
	 //      jQuery("#[playerID]").YTPlayer();
	 //    });
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
				// let location = latitude + "," + longitude + "?units=" + units
				// let fetchJsonp = require("fetch-jsonp");
				// //darkSky
				// let url = "https://api.darksky.net/forecast/04c3762b193aaee40affb899992cef3e/" + location
				// fetchJsonp(url).then( (response) => response.json().then( (json) => this.setState({weather: json}) ) )



				// https://api.darksky.net/forecast/04c3762b193aaee40affb899992cef3e/55.7522,37.6156

				// http://api.openweathermap.org/data/2.5/weather?q=Moscow&appid=f8cfda0ca4b8ccfef50bf143d6133107&units=imperial
				// Temperature. Unit Default: Kelvin, Metric: Celsius, Imperial: Fahrenheit.

				//openWeather
				// http://api.openweathermap.org/data/2.5/weather?lat=55.7522&lon=37.6156&appid=f8cfda0ca4b8ccfef50bf143d6133107&units=metric

				let location = (this.state.activePlace === "My location"
									?  `lat=${latitude}&lon=${longitude}`
									: `q=${this.state.activePlace}`)
				let url = `http://api.openweathermap.org/data/2.5/weather?${location}&appid=f8cfda0ca4b8ccfef50bf143d6133107&units=${units}`;
				let fetchJsonp = require("fetch-jsonp");
				fetchJsonp(url).then( (response) => response.json().then( (json) => {this.setState({weather: json, activePlace: json.name});console.log(json.name);} ) )
				// console.log(this.state.weather);
			})
		}
	}
	
	onDegClick(){
		this.state.units == 'metric'
			? this.setState({units: 'imperial'})
			: this.setState({units: 'metric'});
		this.getLocationAndWeather();
		console.log('Clicked!');
		document.getElementById('subtitleHandler').style.visibility='hidden';
	

		// https://robwu.nl/cors-anywhere.html
		// https://cors-anywhere.herokuapp.com/
		// https://github.com/Rob--W/cors-anywhere/#documentation

		// https://cloud.yandex.ru/docs/translate/api-ref/Translation/translate#responses

		// https://cloud.yandex.ru/docs/cli/quickstart#install
		// https://cloud.yandex.ru/docs/iam/operations/iam-token/create

	// 	fetch('https://cors-anywhere.herokuapp.com/translate.api.cloud.yandex.net/translate/v2/translate', {
	// 	method: 'POST',
		// body: JSON.stringify({
		// 	"sourceLanguageCode": "en",
		// 	"targetLanguageCode": "ru",
		// 	"format": "PLAIN_TEXT",
		// 	"texts": [
		// 		"string"
		// 	],
			
			
		// }),
		
	// 	})
	// 	.then(response => response.json())
	// 	.then(json => console.log(json))
	}


	onCityClick = (e, name) => {
		if (name !== 'My location') { 
			document.getElementById('subtitleHandler').style.visibility='hidden';
		}
		this.setState({
			activePlace : name
		}, () => {
				this.getLocationAndWeather();
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
								<div id="bgndVideo" class="player" data-property="{videoURL:'http://youtu.be/BsekcY04xvQ',containment:'body',autoPlay:true, mute:true, startAt:0, opacity:1}">My video</div>
							</Col>
						</Row>
					</Container>
				</div>			

			</div>		
		)
		
	}	
	
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
