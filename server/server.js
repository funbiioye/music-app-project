const express = require('express');
const cors = require("cors")
const bodyParser = require("body-parser")
const lyricsFinder = require("lyrics-finder")
const SpotifyWebApi = require('spotify-web-api-node');

const app = express()
app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.post('/refresh', (req, res) => {
    const refreshToken = req.body.refreshToken
    const spotifyApi = new SpotifyWebApi({
        redirectUri: 'http://localhost:3000',
        clientId: 'd038dea593d54873bf853cdfcfb1db57',
        clientSecret: 'fcf801676adc4b4782e825c47f03d8fb',
        refreshToken
    })

    spotifyApi
        .refreshAccessToken()
        .then(data => {
            res.json({
                accessToken: data.body.accessToken,
                expiresIn: data.body.expiresIn
            });     
        })
        .catch(() => {
            res.sendStatus(400)
        })   
})

app.post('/login', (req, res) => {
    const code = req.body.code
    const spotifyApi = new SpotifyWebApi({
        redirectUri: 'http://localhost:3000',
        clientId: 'd038dea593d54873bf853cdfcfb1db57',
        clientSecret: 'fcf801676adc4b4782e825c47f03d8fb'
    })

    spotifyApi
        .authorizationCodeGrant(code)
        .then(data => {
            res.json({
                accessToken: data.body.access_token,
                refreshToken: data.body.resfresh_token,
                expiresIn: data.body.expires_in
            })
        })
        .catch((err) => {
            res.sendStatus(400)
        })
})

app.get('/lyrics', async (req, res) => {
    const lyrics = await lyricsFinder(req.querry.artist, req.query.track) || "No Lyrics Found"
    res.json({ lyrics })
})

app.listen(3001) 
