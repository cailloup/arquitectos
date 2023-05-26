

export const assests = {
                            audios: {
                                        vela: "/fragment.mp3",
                                    },

                            colors: {
                                red:"#C33149",
                                green:"#1fbd93",
                                blue:"#128aed",
                                purple:"#943ddb",
                                yellow:"#e6d925" ,
                                orange:"#d45500",
								pink:"#FF80F9",
								seagreen: "#2DD5C6",
								darkgreen: "#1C6F68",
								lightblue: "#86B4FF",
								beige: "#FFF1E2",
								lilac: "#C8C7EE"
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