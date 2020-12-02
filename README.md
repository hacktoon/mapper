# NAMI: World Generator


## DEMO

[https://hacktoon.github.io/nami/](https://hacktoon.github.io/nami/)


## ROADMAP
- [] Use Rect instead of width & height

#### RegionMap
- [] Region borders are stored
- [] Regions adjacency table

#### TectonicsMap
- [] Create Plate register
- Convergent
  - OO : Island Arc + Earthquake
  - OC : Trench + Mountain + Volcano + Earthquake
  - CC : Mountain + Earthquake

- Divergent
  - OO : Oceanic Ridge
  - CC : Rift  + Earthquake

- create ridges separately in tectonics map, using total and start point of border points
- Iterate over region growth borders to distribute hills, cenotes, ravines, lakes, etc
- First 2-3 layers are always land (cratons)

#### ContinentMap
- [] Create Continent

#### BasinMap
- [] determine rivers using graph

#### TerrainMap
- Build distance map from coast borders
- Property (water: bool)
- Use ScanlineFill to discover areas
- Set id's on Grid during scanline fill

#### (MAYBE) ErosionMap
- Eliminate hard/pointy edges - smooth terrain
- discover river paths
- Start from highest points, flood fill

#### OceanMap
- Decide it's type when finished, set type on object WaterBody
- Types: 0:none, 1:river, 2:lake, 3:sea, 5:ocean
  - WaterBody
    - Reference point - where fill started, used to scanline again for searches

#### TemperatureMap
- Use two opposite points on regionMap
- Value range: -50:50

#### WindMap
- Value range: 0:10, varies according to month

#### RainMap
- Value range: 0:10, varies according to month and windmap

#### Other
- Vegetation/wildlife density: adjusted by humidity, temperature and height
- Cities
  - Use disc point allocation on grid
- Roads
  - create junction points between route ends


### Interface
- Create "Focus" property to render map view centered on that
- Optimize canvas rendering
  - Use offscreen canvas when `map.size <  screen.size`
  - Add tool to live-test drawing functions on console
- Add/use URL with parameters
