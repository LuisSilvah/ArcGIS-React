import {
  ArcGraphic,
  ArcGraphicsLayer,
  ArcMapView,
  createPoint,
  createPolygon,
  createPolyline,
  createSimpleFillSymbol,
  createSimpleLineSymbol,
  createSimpleMarkerSymbol,
} from "./ArcGIS-ReactKit";

import * as geometryEngine from "@arcgis/core/geometry/geometryEngine";

function App() {
  const point = createPoint({
    longitude: 55,
    latitude: 25,
  });

  const simpleMarkerSymbol = createSimpleMarkerSymbol({
    color: "blue",
  });

  const polyline = createPolyline({
    paths: [
      [
        [55.01972588152597, 25.03419725426069],
        [54.9653361125938, 25.049087857704478],
        [54.944834050161006, 25.000418053803813],
      ],
    ],
  });

  const simpleLineSymbol = createSimpleLineSymbol({
    color: "blue",
    width: 3,
  });

  const polygons = [
    {
      id: 1,
      type: "polygon",
      rings: [
        [
          [54.99484672291234, 25.001548254997985],
          [54.98948674805712, 24.99896433116001],
          [55.00100499189463, 24.980978716284596],
          [55.00568071464073, 24.983149533564287],
          [54.99484672291234, 25.001548254997985],
        ],
      ],
    },
    {
      id: 2,
      type: "polygon",
      rings: [
        [
          [54.98228605926013, 24.98657508885509],
          [54.96751085114653, 24.978701213355905],
          [54.98090068602207, 24.967529098854413],
          [54.99482452257041, 24.975112112813818],
          [54.98228605926013, 24.98657508885509],
        ],
      ],
    },
    {
      id: 3,
      type: "polygon",
      rings: [
        [
          [55.017842786866964, 24.97096756157451],
          [54.98770865389969, 24.961227451747177],
          [55.01248173120126, 24.945695934557932],
          [55.029058110291004, 24.95495127458676],
          [55.017842786866964, 24.97096756157451],
        ],
      ],
    },
  ];

  const simpleFillSymbol = createSimpleFillSymbol({
      color: [55, 211, 138, 0.4], 
      outline: {
        color: [0, 0, 0], 
        width: 1,
      },
  });

  return (
    <div className="position-relative">
      <ArcMapView mapProperties={{  basemap: "arcgis-imagery" }}>
        <ArcGraphicsLayer>
          <ArcGraphic geometry={point} symbol={simpleMarkerSymbol} />
          <ArcGraphic geometry={polyline} symbol={simpleLineSymbol} />
          {polygons.map((polygonData) => {
            const polygon = createPolygon({
              rings: polygonData.rings,
            });

            const areaInSquareMeters = geometryEngine.geodesicArea(polygon, "square-meters");
            const areaInHectares = areaInSquareMeters / 10000;
            console.log("Área do polígono:", areaInHectares, "hectares");
      
            return (
              <div key={polygonData.id}>
                <ArcGraphic popupTemplate={{
                  title: "polígono",
                  content: `Área do polígono ${areaInHectares}`
                }} geometry={polygon} symbol={simpleFillSymbol} />
                </div>
            );
          })}
        </ArcGraphicsLayer>
      </ArcMapView>
    </div>
  );
}

export default App;
