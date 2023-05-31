

export const assests = {
                            audios: {
                                        vela: "/fragment.mp3",
                                    },

                            colors: {
                                red:"#FAEDCB",
                                green:"#C9E4DE",
                                blue:"#C6DEF1",
                                purple:"#DBCDF0",
                                yellow:"#F2C6DE" ,
                                orange:"#FFADAD",
				pink:"#F7D9C4",
				seagreen: "#E4F1EE",
				darkgreen: "#FFD6A5",
				lightblue: "#FDFFB6",
				beige: "#D9EDF8",
				lilac: "#DEDAF4"
                            },
                            buildingTypes:["C. C. Municipal","Comercial","Educativo","Esparcimiento","Histórico","Hotelera","Municipal","Público","Religioso","Urbano","Vivienda","Otro"],
                            icons:{
                                mapPoint: (color) => {
                                    return {
                                        path: "M-1.547 0q2.906 0 4.945 2.039t2.039 4.945q0 1.453-0.727 3.328t-1.758 3.516-2.039 3.070-1.711 2.273l-0.75 0.797q-0.281-0.328-0.75-0.867t-1.688-2.156-2.133-3.141-1.664-3.445-0.75-3.375q0-2.906 2.039-4.945t4.945-2.039z",
                                        fillColor: color ,
                                        fillOpacity: 0.85,
                                        strokeWeight: 0,
                                        rotation: 0,
                                        scale: 2,
                                        anchor: new google.maps.Point(0, 20),
                                    }}
                            }
                        }
