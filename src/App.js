import React, { useState, useEffect } from 'react'
import {
  Card,
  MenuItem,
  FormControl,
  Select,
  CardContent,
  withWidth,
} from '@material-ui/core'
import ToggleButton from '@material-ui/lab/ToggleButton'
import {
  withStyles,
  createMuiTheme,
  ThemeProvider,
} from '@material-ui/core/styles'
import InfoBox from './InfoBox'
import Map from './Map'
import DarkMap from './DarkMap'
import Table from './Table'
import LineGraph from './LineGraph'
import { sortData, prettyPrintStat } from './util'
import './App.css'
import 'leaflet/dist/leaflet.css'

import TypeWriter from './models/TypeWriter'

import FlashOffSharpIcon from '@material-ui/icons/FlashOffSharp'
import FlashOnSharpIcon from '@material-ui/icons/FlashOnSharp'

function App(props) {
  const [countries, setCountries] = useState([])
  const [country, setCountry] = useState('worldwide')
  const [countryInfo, setCountryInfo] = useState({})
  const [tableData, setTableData] = useState([])
  const [mapCenter, setMapCenter] = useState([0, 0])
  const [mapZoom, setMapZoom] = useState(3)
  const [mapCountries, setMapCountries] = useState([])
  const [casesType, setCasesType] = useState('cases')
  const [darkState, setDarkState] = useState(false)

  const palleteType = darkState ? 'dark' : 'light'
  const theme = createMuiTheme({
    palette: {
      type: palleteType,
    },
  })

  useEffect(() => {
    fetch('https://disease.sh/v3/covid-19/all')
      .then((response) => response.json())
      .then((data) => {
        setCountryInfo(data)
      })
  }, [])

  useEffect(() => {
    const getCountriesData = async () => {
      await fetch('https://disease.sh/v3/covid-19/countries')
        .then((response) => response.json())
        .then((data) => {
          const countries = data.map((country) => ({
            name: country.country,
            value: country.countryInfo.iso2,
          }))
          const sortedData = sortData(data)
          setTableData(sortedData)
          setMapCountries(data)
          setCountries(countries)
        })
    }
    getCountriesData()
  }, [])

  useEffect(() => {
    document.addEventListener('DOMContentLoaded', init)

    // Init App
    function init() {
      const txtElement = document.querySelector('.app__header__text--type')
      const words = JSON.parse(txtElement.getAttribute('data-words'))
      const wait = txtElement.getAttribute('data-wait')
      // Init TypeWriter
      new TypeWriter(txtElement, words, wait)
    }
  }, [])

  const onCountryChange = (event) => {
    let countryCode = event.target.value
    setCountry(countryCode)
  }

  useEffect(() => {
    const url =
      country === 'worldwide'
        ? 'https://disease.sh/v3/covid-19/all'
        : `https://disease.sh/v3/covid-19/countries/${country}`

    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        if (country === 'worldwide') {
          setMapCenter([0, 0])
          setMapZoom(3)
        } else if (country !== 'worldwide') {
          setMapCenter([data.countryInfo.lat, data.countryInfo.long])
          setMapZoom(5)
        }
        setCountryInfo(data)
      })
  }, [country, mapZoom])

  return (
    <ThemeProvider theme={theme}>
      <div
        className={
          theme.palette.type === 'dark'
            ? `${
                props.width === 'lg'
                  ? 'app dark--main'
                  : 'app--small dark--main'
              }`
            : `${props.width === 'lg' ? 'app' : 'app--small'}`
        }
      >
        <div className='app__left'>
          <div className='app__header'>
            <h1
              className={`app__header__text app__header__text--color-${casesType}`}
            >
              COVID-19&nbsp;
              <span
                className='app__header__text--type'
                data-wait='3000'
                data-words='["Tracker", "Confirmed Cases", "Recovered Cases" , "Death Cases"]'
              ></span>
            </h1>

            <ToggleButton
              style={{
                position: 'absolute',
                right: '9em',
              }}
              value={darkState}
              selected={darkState}
              onChange={() => setDarkState(!darkState)}
              className='app__toggle--margin'
            >
              {darkState && <FlashOnSharpIcon />}
              {!darkState && <FlashOffSharpIcon />}
            </ToggleButton>

            <FormControl
              className={
                theme.palette.type === 'light'
                  ? 'app__dropdown'
                  : 'app__dropdown dark--dropdown'
              }
            >
              <Select
                variant='outlined'
                value={country}
                className={
                  theme.palette.type === 'light'
                    ? 'select'
                    : 'select dark--select'
                }
                onChange={onCountryChange}
              >
                <MenuItem value='worldwide'>WorldWide</MenuItem>
                {countries.map((country, index) => (
                  <MenuItem
                    key={`country-dropdown-${index}`}
                    value={country.value}
                  >
                    {country.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>

          <div className='app__stats'>
            <InfoBox
              isRed
              active={casesType === 'cases'}
              title='Cases'
              cases={prettyPrintStat(countryInfo.todayCases)}
              total={prettyPrintStat(countryInfo.cases)}
              onClick={() => setCasesType('cases')}
            />
            <InfoBox
              isGreen
              active={casesType === 'recovered'}
              title='Recovered'
              cases={prettyPrintStat(countryInfo.todayRecovered)}
              total={prettyPrintStat(countryInfo.recovered)}
              onClick={() => setCasesType('recovered')}
            />
            <InfoBox
              isOrange
              active={casesType === 'deaths'}
              title='Deaths'
              cases={prettyPrintStat(countryInfo.todayDeaths)}
              total={prettyPrintStat(countryInfo.deaths)}
              onClick={() => setCasesType('deaths')}
            />
          </div>

          {theme.palette.type === 'light' ? (
            <Map
              center={mapCenter}
              zoom={mapZoom}
              countries={mapCountries}
              casesType={casesType}
              minZoom={mapZoom}
              country={country}
            />
          ) : (
            <DarkMap
              center={mapCenter}
              zoom={mapZoom}
              countries={mapCountries}
              casesType={casesType}
              minZoom={mapZoom}
              country={country}
            />
          )}
        </div>

        <Card
          className={
            theme.palette.type === 'dark'
              ? 'app__right dark--right'
              : 'app__right'
          }
        >
          <CardContent>
            <h3>LIVE CASES BY COUNTRY</h3>
            <Table countries={tableData} />
            <h3 className='app__graphTitle'>Worldwide new {casesType}</h3>
            <LineGraph
              className='app__graph'
              casesType={casesType}
              theme={theme.palette.type}
            />
          </CardContent>
        </Card>
      </div>
    </ThemeProvider>
  )
}

export default withWidth()(withStyles({ withTheme: true })(App))
