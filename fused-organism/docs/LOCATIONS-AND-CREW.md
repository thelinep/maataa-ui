# Locations, CAD plans, and crew profiles

Components for the people and places on a production. They live in `@maataa/ui/maps` and `@maataa/ui/data`, and all text is in the Hindi catalog.

## Locations: CAD and geospatial

| Piece                  | What it does                                                                                                                                                                                                                                                                                                     |
| ---------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `parseDxf(text)`       | Reads an ASCII DXF (AutoCAD, LibreCAD, QCAD, FreeCAD, SketchUp export): lines, polylines with curved segments, circles, arcs, ellipses, points, text, and blocks with position, scale and rotation. Keeps layers, layer colors and units (`$INSUNITS`). Hatches, dimensions and splines are skipped and counted. |
| `CadPlanViewer`        | Draws the plan. Layers on and off; zoom with buttons, wheel, + and −; pan by dragging or with arrow keys; 0 fits it back. Measure snaps to the nearest corner and says the distance, in metres too when the drawing has units. Has an Open DXF button.                                                           |
| `georeference(points)` | From two or more points known on both the plan and the map: scale (metres per drawing unit), which way the plan's top faces, the fit error, and conversion both ways between plan coordinates and latitude/longitude.                                                                                            |
| `LocationSite`         | One location in one place: map pin, nearby points (unit base, parking), the plan's corners on the map, the CAD plan with zones, measurements, and permits.                                                                                                                                                       |

DWG is a closed binary format and is not read in the browser. Save or export the drawing as DXF (every CAD program can), then open that. The viewer says this in plain words when someone picks a DWG.

Georeferencing is a similarity fit (move, turn, scale), accurate for sites up to a few kilometres. Two control points are enough. With three or more, the fit error shows whether a point was misplaced.

## People: avatars, iCards, profiles

**`BeingAvatar`** covers anyone in a production:

- people and animal actors on the call sheet (`variant="crew"`);
- characters in the story (`"character"`, where `vitality` reads as a condition: strong, hurt, badly hurt, down);
- game-style avatars (`"game"`, with a hit-point bar).

`species` is a list, so a hybrid character can be `["human", "robot"]`. `SPECIES` has common ones; pass your own `Species` objects for others.

**Health is hidden by default.** It shows only when `showHealth` is true. The app decides that from the viewer's role, for example production and medical roles. With `showHealth` off, the avatar doesn't hint that health notes exist.

**`CrewIdCard`** prints at true CR80 size (54 × 85.6 mm), in fixed dark-on-white colors in every theme, so it prints and scans the same way:

- **Front:** production name in the department's color, photo, name, designation, department, crew ID, valid-until date, and a QR code.
- **Back:** emergency contact, the card holder's phone and email, and a return-to address.

**`QrCode`** and `encodeQr` make QR codes with no dependency. The encoder covers versions 1–40 and levels L/M/Q/H, and was checked against OpenCV's decoder, including Hindi text.

**`CrewProfile`** has a header (avatar, designation, department, crew ID, rating) and these tabs:

| Tab               | Holds                                                                           |
| ----------------- | ------------------------------------------------------------------------------- |
| Work              | Credits: title, role, year                                                      |
| Tools             | Kit, marked when they bring their own                                           |
| Utils             | Practical details: languages, licences, passport, own vehicle                   |
| Rating            | Average, count and reviews (`StarRating`)                                       |
| Pricing           | Day rate, overtime and packages, in rupees by default                           |
| Call sheets       | Date, call time, location, status                                               |
| Availability      | `AvailabilityCalendar` with booked days                                         |
| Documents         | Contracts, NDAs and permits, with status and expiry                             |
| Emergency contact | Name, relation, phone (a tap-to-call link)                                      |
| Health            | Only when `canSeeHealth` is true; otherwise the tab isn't there                 |
| iCard             | The ID card with a Print button, when `production` and `organisation` are given |

`PRODUCTION_DEPARTMENTS` lists 18 departments in call-sheet order, including Animal handling. Built-in department names are translated.

Health and emergency details are personal data. Load them only for viewers allowed to see them, and don't send them to the browser otherwise. Hiding a tab in the browser is not access control.
