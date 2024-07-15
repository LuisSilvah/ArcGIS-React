import { useEffect, useRef, useState } from "react";
import GraphicsLayer from "@arcgis/core/layers/GraphicsLayer";
import Sketch from "@arcgis/core/widgets/Sketch";
import { createMapView } from "../../ArcGIS-SDK";
import { MapViewContext } from "../Contexts";
import Polygon from "@arcgis/core/geometry/Polygon";
import * as geometryEngine from "@arcgis/core/geometry/geometryEngine";

interface IArcMapViewProps {
  children?: React.ReactNode;
  mapProperties?: __esri.MapProperties;
}

export const ArcMapView = (props: IArcMapViewProps) => {
  const { children, mapProperties } = props;
  const mapRef = useRef(null);
  const [view, setView] = useState<__esri.MapView | undefined>();
  const [graphicsLayer, setGraphicsLayer] = useState<GraphicsLayer | undefined>();

    useEffect(() => {
      if (!mapRef?.current) return;

      const _view =  createMapView({ container: mapRef.current, mapProperties  });
      setView(_view);

      const _graphicsLayer = new GraphicsLayer();
      setGraphicsLayer(_graphicsLayer);
      _view.map.add(_graphicsLayer);

      return () => _view && _view.destroy();
    }, [mapProperties]);

 

  useEffect(() => {
    if (!view || !graphicsLayer) return;

    // view.map.basemap = Basemap.fromId(mapProperties?.basemap as string);

    const sketch = new Sketch({
      layer: graphicsLayer,
      view: view,
      creationMode: "update",
      availableCreateTools: ["polygon"]
    });

    // Evento de escuta para criação de novos gráficos
    sketch.on("create", (event) => {
      if (event.state === "complete" && event.graphic.geometry.type === "polygon") {
        const polygon = event.graphic.geometry as Polygon;
        console.log("Polygon coordinates: ", polygon.rings);

        const areaInSquareMeters = geometryEngine.geodesicArea(polygon, "square-meters");
            const areaInHectares = areaInSquareMeters / 10000;
            console.log("Área do polígono:", areaInHectares, "hectares");
      }
    });

    view.ui.add(sketch, "top-right");
  }, [view, graphicsLayer, mapProperties]);

  return (
    <div className="viewDiv" ref={mapRef}>
      {view && (
        <MapViewContext.Provider value={{ view }}>
          {children}
        </MapViewContext.Provider>
      )}
    </div>
  );
};
