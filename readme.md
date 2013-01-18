# Austin Metro
This is a project to help users find out the next route available for Austin Metro public transit. First we are concentrating on the rail with intentions of expanding to the bus lines when the code has reached feature critical mass and has been stablized.

## Behavior
- site detects nearest station
- gives upcoming times
- each station needs a real page
- get for station should respond with HTML or JSON depending on request

## Tech Notes
### AppCache
- offline pages, js, everything

### GeoLocation
- if location fails, give selection method for station

### Localstorage
- store route data accessed
- do we cache the whole route? station? direction?
- Versioning: date? number? hash?