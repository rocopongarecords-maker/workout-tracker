-- Amsterdam Gym Seed Data
-- Run this AFTER gym_schema.sql
-- ~50 gyms across Amsterdam with real names, addresses, and approximate coordinates

-- ═══════════════════════════════════════════
-- BASIC-FIT (~25 locations)
-- Equipment: standard commercial gym setup
-- ═══════════════════════════════════════════

INSERT INTO gyms (name, chain, address, city, country, latitude, longitude, equipment, amenities, verified) VALUES
('Basic-Fit Amsterdam Overtoom', 'Basic-Fit', 'Overtoom 445', 'Amsterdam', 'Netherlands', 52.3625, 4.8630,
 '["barbell","dumbbell","machine","cable","smith_machine","leg_press","leg_extension","leg_curl","lat_pulldown","chest_press_machine","pec_deck","treadmill","bike","elliptical","pull_up_bar","dip_station"]',
 '["showers","lockers"]', true),

('Basic-Fit Amsterdam Kinkerstraat', 'Basic-Fit', 'Kinkerstraat 212', 'Amsterdam', 'Netherlands', 52.3650, 4.8680,
 '["barbell","dumbbell","machine","cable","smith_machine","leg_press","leg_extension","leg_curl","lat_pulldown","chest_press_machine","pec_deck","treadmill","bike","elliptical","pull_up_bar","dip_station"]',
 '["showers","lockers"]', true),

('Basic-Fit Amsterdam Westerpark', 'Basic-Fit', 'Haarlemmerweg 8c', 'Amsterdam', 'Netherlands', 52.3860, 4.8710,
 '["barbell","dumbbell","machine","cable","smith_machine","leg_press","leg_extension","leg_curl","lat_pulldown","chest_press_machine","pec_deck","treadmill","bike","elliptical","pull_up_bar","dip_station"]',
 '["showers","lockers"]', true),

('Basic-Fit Amsterdam Amstelstation', 'Basic-Fit', 'Julianaplein 1', 'Amsterdam', 'Netherlands', 52.3460, 4.9170,
 '["barbell","dumbbell","machine","cable","smith_machine","leg_press","leg_extension","leg_curl","lat_pulldown","chest_press_machine","pec_deck","treadmill","bike","elliptical","pull_up_bar","dip_station"]',
 '["showers","lockers"]', true),

('Basic-Fit Amsterdam Linnaeusstraat', 'Basic-Fit', 'Linnaeusstraat 2', 'Amsterdam', 'Netherlands', 52.3605, 4.9230,
 '["barbell","dumbbell","machine","cable","smith_machine","leg_press","leg_extension","leg_curl","lat_pulldown","chest_press_machine","pec_deck","treadmill","bike","elliptical","pull_up_bar","dip_station"]',
 '["showers","lockers"]', true),

('Basic-Fit Amsterdam Javastraat', 'Basic-Fit', 'Javastraat 42', 'Amsterdam', 'Netherlands', 52.3640, 4.9370,
 '["barbell","dumbbell","machine","cable","smith_machine","leg_press","leg_extension","leg_curl","lat_pulldown","chest_press_machine","pec_deck","treadmill","bike","elliptical","pull_up_bar","dip_station"]',
 '["showers","lockers"]', true),

('Basic-Fit Amsterdam Centurion', 'Basic-Fit', 'Centurionbaan 160', 'Amsterdam', 'Netherlands', 52.3130, 4.9490,
 '["barbell","dumbbell","machine","cable","smith_machine","leg_press","leg_extension","leg_curl","lat_pulldown","chest_press_machine","pec_deck","treadmill","bike","elliptical","pull_up_bar","dip_station"]',
 '["showers","lockers","parking"]', true),

('Basic-Fit Amsterdam Bos en Lommer', 'Basic-Fit', 'Bos en Lommerweg 213', 'Amsterdam', 'Netherlands', 52.3780, 4.8530,
 '["barbell","dumbbell","machine","cable","smith_machine","leg_press","leg_extension","leg_curl","lat_pulldown","chest_press_machine","pec_deck","treadmill","bike","elliptical","pull_up_bar","dip_station"]',
 '["showers","lockers"]', true),

('Basic-Fit Amsterdam De Pijp', 'Basic-Fit', 'Ferdinand Bolstraat 133', 'Amsterdam', 'Netherlands', 52.3520, 4.8930,
 '["barbell","dumbbell","machine","cable","smith_machine","leg_press","leg_extension","leg_curl","lat_pulldown","chest_press_machine","pec_deck","treadmill","bike","elliptical","pull_up_bar","dip_station"]',
 '["showers","lockers"]', true),

('Basic-Fit Amsterdam Buikslotermeerplein', 'Basic-Fit', 'Buikslotermeerplein 157', 'Amsterdam', 'Netherlands', 52.4010, 4.9370,
 '["barbell","dumbbell","machine","cable","smith_machine","leg_press","leg_extension","leg_curl","lat_pulldown","chest_press_machine","pec_deck","treadmill","bike","elliptical","pull_up_bar","dip_station"]',
 '["showers","lockers","parking"]', true),

('Basic-Fit Amsterdam Sloterdijk', 'Basic-Fit', 'Radarweg 60', 'Amsterdam', 'Netherlands', 52.3900, 4.8360,
 '["barbell","dumbbell","machine","cable","smith_machine","leg_press","leg_extension","leg_curl","lat_pulldown","chest_press_machine","pec_deck","treadmill","bike","elliptical","pull_up_bar","dip_station"]',
 '["showers","lockers","parking"]', true),

('Basic-Fit Amsterdam Haarlemmermeerstation', 'Basic-Fit', 'Amstelveenseweg 134', 'Amsterdam', 'Netherlands', 52.3490, 4.8680,
 '["barbell","dumbbell","machine","cable","smith_machine","leg_press","leg_extension","leg_curl","lat_pulldown","chest_press_machine","pec_deck","treadmill","bike","elliptical","pull_up_bar","dip_station"]',
 '["showers","lockers"]', true),

('Basic-Fit Amsterdam Nieuw-West Osdorp', 'Basic-Fit', 'Osdorpplein 460', 'Amsterdam', 'Netherlands', 52.3590, 4.8070,
 '["barbell","dumbbell","machine","cable","smith_machine","leg_press","leg_extension","leg_curl","lat_pulldown","chest_press_machine","pec_deck","treadmill","bike","elliptical","pull_up_bar","dip_station"]',
 '["showers","lockers","parking"]', true),

('Basic-Fit Amsterdam Roetersstraat', 'Basic-Fit', 'Roetersstraat 11', 'Amsterdam', 'Netherlands', 52.3630, 4.9120,
 '["barbell","dumbbell","machine","cable","smith_machine","leg_press","leg_extension","leg_curl","lat_pulldown","chest_press_machine","pec_deck","treadmill","bike","elliptical","pull_up_bar","dip_station"]',
 '["showers","lockers"]', true),

('Basic-Fit Amsterdam Gelderlandplein', 'Basic-Fit', 'Van Leijenberghlaan 43', 'Amsterdam', 'Netherlands', 52.3330, 4.8760,
 '["barbell","dumbbell","machine","cable","smith_machine","leg_press","leg_extension","leg_curl","lat_pulldown","chest_press_machine","pec_deck","treadmill","bike","elliptical","pull_up_bar","dip_station"]',
 '["showers","lockers","parking"]', true),

('Basic-Fit Amsterdam Muiderpoortstation', 'Basic-Fit', 'Eerste van Swindenstraat 40', 'Amsterdam', 'Netherlands', 52.3610, 4.9280,
 '["barbell","dumbbell","machine","cable","smith_machine","leg_press","leg_extension","leg_curl","lat_pulldown","chest_press_machine","pec_deck","treadmill","bike","elliptical","pull_up_bar","dip_station"]',
 '["showers","lockers"]', true),

('Basic-Fit Amsterdam Waterlooplein', 'Basic-Fit', 'Waterlooplein 1', 'Amsterdam', 'Netherlands', 52.3670, 4.9020,
 '["barbell","dumbbell","machine","cable","smith_machine","leg_press","leg_extension","leg_curl","lat_pulldown","chest_press_machine","pec_deck","treadmill","bike","elliptical","pull_up_bar","dip_station"]',
 '["showers","lockers"]', true);

-- ═══════════════════════════════════════════
-- TRAINMORE (~10 locations)
-- Equipment: full gym with more free weight options
-- ═══════════════════════════════════════════

INSERT INTO gyms (name, chain, address, city, country, latitude, longitude, equipment, amenities, verified) VALUES
('TrainMore Koninginneweg', 'TrainMore', 'Koninginneweg 209', 'Amsterdam', 'Netherlands', 52.3500, 4.8710,
 '["barbell","dumbbell","kettlebell","ez_bar","machine","cable","smith_machine","leg_press","hack_squat","leg_extension","leg_curl","lat_pulldown","chest_press_machine","pec_deck","hip_thrust_machine","calf_raise_machine","power_rack","bumper_plates","treadmill","bike","rowing_machine","stairmaster","elliptical","pull_up_bar","dip_station"]',
 '["showers","lockers","towels","sauna"]', true),

('TrainMore Wibautstraat', 'TrainMore', 'Wibautstraat 150', 'Amsterdam', 'Netherlands', 52.3530, 4.9100,
 '["barbell","dumbbell","kettlebell","ez_bar","machine","cable","smith_machine","leg_press","hack_squat","leg_extension","leg_curl","lat_pulldown","chest_press_machine","pec_deck","hip_thrust_machine","calf_raise_machine","power_rack","bumper_plates","treadmill","bike","rowing_machine","stairmaster","elliptical","pull_up_bar","dip_station"]',
 '["showers","lockers","towels","sauna"]', true),

('TrainMore CEC', 'TrainMore', 'Europaplein 22', 'Amsterdam', 'Netherlands', 52.3380, 4.8920,
 '["barbell","dumbbell","kettlebell","ez_bar","machine","cable","smith_machine","leg_press","hack_squat","leg_extension","leg_curl","lat_pulldown","chest_press_machine","pec_deck","hip_thrust_machine","calf_raise_machine","power_rack","bumper_plates","treadmill","bike","rowing_machine","stairmaster","elliptical","pull_up_bar","dip_station"]',
 '["showers","lockers","towels","sauna","classes"]', true),

('TrainMore Rokin', 'TrainMore', 'Rokin 111', 'Amsterdam', 'Netherlands', 52.3680, 4.8920,
 '["barbell","dumbbell","kettlebell","ez_bar","machine","cable","smith_machine","leg_press","hack_squat","leg_extension","leg_curl","lat_pulldown","chest_press_machine","pec_deck","hip_thrust_machine","calf_raise_machine","power_rack","bumper_plates","treadmill","bike","rowing_machine","stairmaster","elliptical","pull_up_bar","dip_station"]',
 '["showers","lockers","towels"]', true),

('TrainMore Overtoom', 'TrainMore', 'Overtoom 301', 'Amsterdam', 'Netherlands', 52.3620, 4.8590,
 '["barbell","dumbbell","kettlebell","ez_bar","machine","cable","smith_machine","leg_press","hack_squat","leg_extension","leg_curl","lat_pulldown","chest_press_machine","pec_deck","hip_thrust_machine","calf_raise_machine","power_rack","bumper_plates","treadmill","bike","rowing_machine","stairmaster","elliptical","pull_up_bar","dip_station"]',
 '["showers","lockers","towels","sauna"]', true),

('TrainMore IJburg', 'TrainMore', 'IJburglaan 756', 'Amsterdam', 'Netherlands', 52.3570, 4.9650,
 '["barbell","dumbbell","kettlebell","ez_bar","machine","cable","smith_machine","leg_press","hack_squat","leg_extension","leg_curl","lat_pulldown","chest_press_machine","pec_deck","hip_thrust_machine","calf_raise_machine","power_rack","bumper_plates","treadmill","bike","rowing_machine","stairmaster","elliptical","pull_up_bar","dip_station"]',
 '["showers","lockers","towels","parking"]', true),

('TrainMore Houthavens', 'TrainMore', 'Danzigerkade 14', 'Amsterdam', 'Netherlands', 52.3920, 4.8730,
 '["barbell","dumbbell","kettlebell","ez_bar","machine","cable","smith_machine","leg_press","hack_squat","leg_extension","leg_curl","lat_pulldown","chest_press_machine","pec_deck","hip_thrust_machine","calf_raise_machine","power_rack","bumper_plates","treadmill","bike","rowing_machine","stairmaster","elliptical","pull_up_bar","dip_station"]',
 '["showers","lockers","towels","sauna","classes"]', true),

('TrainMore Zuidas', 'TrainMore', 'De Boelelaan 7', 'Amsterdam', 'Netherlands', 52.3370, 4.8750,
 '["barbell","dumbbell","kettlebell","ez_bar","machine","cable","smith_machine","leg_press","hack_squat","leg_extension","leg_curl","lat_pulldown","chest_press_machine","pec_deck","hip_thrust_machine","calf_raise_machine","power_rack","bumper_plates","treadmill","bike","rowing_machine","stairmaster","elliptical","pull_up_bar","dip_station"]',
 '["showers","lockers","towels","sauna","classes"]', true);

-- ═══════════════════════════════════════════
-- VONDELGYM (2 locations)
-- Equipment: premium with specialty gear
-- ═══════════════════════════════════════════

INSERT INTO gyms (name, chain, address, city, country, latitude, longitude, equipment, amenities, verified) VALUES
('Vondelgym West', 'Vondelgym', 'Overtoom 59', 'Amsterdam', 'Netherlands', 52.3630, 4.8760,
 '["barbell","dumbbell","kettlebell","ez_bar","trap_bar","machine","cable","smith_machine","leg_press","hack_squat","leg_extension","leg_curl","lat_pulldown","chest_press_machine","pec_deck","hip_thrust_machine","calf_raise_machine","power_rack","bumper_plates","competition_bench","glute_ham_raise","treadmill","bike","rowing_machine","stairmaster","elliptical","pull_up_bar","dip_station","roman_chair","ab_wheel","swiss_ball","resistance_bands"]',
 '["showers","lockers","towels","sauna","classes","wifi"]', true),

('Vondelgym East', 'Vondelgym', 'Linnaeusparkweg 29', 'Amsterdam', 'Netherlands', 52.3560, 4.9210,
 '["barbell","dumbbell","kettlebell","ez_bar","trap_bar","machine","cable","smith_machine","leg_press","hack_squat","leg_extension","leg_curl","lat_pulldown","chest_press_machine","pec_deck","hip_thrust_machine","calf_raise_machine","power_rack","bumper_plates","competition_bench","glute_ham_raise","treadmill","bike","rowing_machine","stairmaster","elliptical","pull_up_bar","dip_station","roman_chair","ab_wheel","swiss_ball","resistance_bands"]',
 '["showers","lockers","towels","sauna","classes","wifi"]', true);

-- ═══════════════════════════════════════════
-- SPORTCITY (~5 locations)
-- Equipment: similar to TrainMore
-- ═══════════════════════════════════════════

INSERT INTO gyms (name, chain, address, city, country, latitude, longitude, equipment, amenities, verified) VALUES
('SportCity Amsterdam Zuid', 'SportCity', 'Beethovenstraat 69', 'Amsterdam', 'Netherlands', 52.3440, 4.8830,
 '["barbell","dumbbell","kettlebell","ez_bar","machine","cable","smith_machine","leg_press","hack_squat","leg_extension","leg_curl","lat_pulldown","chest_press_machine","pec_deck","hip_thrust_machine","power_rack","treadmill","bike","rowing_machine","stairmaster","elliptical","pull_up_bar","dip_station","swiss_ball"]',
 '["showers","lockers","sauna","pool","classes"]', true),

('SportCity Amsterdam Centrum', 'SportCity', 'Singel 15', 'Amsterdam', 'Netherlands', 52.3780, 4.8930,
 '["barbell","dumbbell","kettlebell","ez_bar","machine","cable","smith_machine","leg_press","hack_squat","leg_extension","leg_curl","lat_pulldown","chest_press_machine","pec_deck","hip_thrust_machine","power_rack","treadmill","bike","rowing_machine","stairmaster","elliptical","pull_up_bar","dip_station","swiss_ball"]',
 '["showers","lockers","sauna","classes"]', true),

('SportCity Amsterdam Oost', 'SportCity', 'Middenweg 54', 'Amsterdam', 'Netherlands', 52.3510, 4.9280,
 '["barbell","dumbbell","kettlebell","ez_bar","machine","cable","smith_machine","leg_press","hack_squat","leg_extension","leg_curl","lat_pulldown","chest_press_machine","pec_deck","hip_thrust_machine","power_rack","treadmill","bike","rowing_machine","stairmaster","elliptical","pull_up_bar","dip_station","swiss_ball"]',
 '["showers","lockers","sauna","pool","classes","parking"]', true),

('SportCity Amsterdam West', 'SportCity', 'Kostverlorenvaart 20', 'Amsterdam', 'Netherlands', 52.3640, 4.8450,
 '["barbell","dumbbell","kettlebell","ez_bar","machine","cable","smith_machine","leg_press","hack_squat","leg_extension","leg_curl","lat_pulldown","chest_press_machine","pec_deck","hip_thrust_machine","power_rack","treadmill","bike","rowing_machine","stairmaster","elliptical","pull_up_bar","dip_station","swiss_ball"]',
 '["showers","lockers","sauna","classes"]', true);

-- ═══════════════════════════════════════════
-- CROSSFIT BOXES (~5 locations)
-- Equipment: barbell-focused with Olympic lifting gear
-- ═══════════════════════════════════════════

INSERT INTO gyms (name, chain, address, city, country, latitude, longitude, equipment, amenities, verified) VALUES
('CrossFit Amsterdam', 'CrossFit', 'Contactweg 47', 'Amsterdam', 'Netherlands', 52.3920, 4.8380,
 '["barbell","dumbbell","kettlebell","pull_up_bar","bumper_plates","power_rack","rowing_machine","resistance_bands","ab_wheel","dip_station","swiss_ball"]',
 '["showers","lockers","classes","parking"]', true),

('CrossFit MSN', 'CrossFit', 'Gedempt Hamerkanaal 28', 'Amsterdam', 'Netherlands', 52.3910, 4.9210,
 '["barbell","dumbbell","kettlebell","pull_up_bar","bumper_plates","power_rack","rowing_machine","resistance_bands","ab_wheel","dip_station","swiss_ball"]',
 '["showers","lockers","classes"]', true),

('CrossFit 020', 'CrossFit', 'Transformatorweg 26', 'Amsterdam', 'Netherlands', 52.3890, 4.8390,
 '["barbell","dumbbell","kettlebell","pull_up_bar","bumper_plates","power_rack","rowing_machine","resistance_bands","ab_wheel","dip_station","swiss_ball"]',
 '["showers","lockers","classes","parking"]', true),

('CrossFit Jordaan', 'CrossFit', 'Marnixstraat 250', 'Amsterdam', 'Netherlands', 52.3710, 4.8800,
 '["barbell","dumbbell","kettlebell","pull_up_bar","bumper_plates","power_rack","rowing_machine","resistance_bands","ab_wheel","dip_station","swiss_ball"]',
 '["showers","lockers","classes"]', true),

('CrossFit De Pijp', 'CrossFit', 'Van Woustraat 175', 'Amsterdam', 'Netherlands', 52.3510, 4.8980,
 '["barbell","dumbbell","kettlebell","pull_up_bar","bumper_plates","power_rack","rowing_machine","resistance_bands","ab_wheel","dip_station","swiss_ball"]',
 '["showers","lockers","classes"]', true);

-- ═══════════════════════════════════════════
-- FIT FOR FREE (~4 locations)
-- Equipment: budget gym, basic setup
-- ═══════════════════════════════════════════

INSERT INTO gyms (name, chain, address, city, country, latitude, longitude, equipment, amenities, verified) VALUES
('Fit For Free Amsterdam Osdorp', 'Fit For Free', 'Osdorperban 140', 'Amsterdam', 'Netherlands', 52.3570, 4.7980,
 '["dumbbell","machine","cable","smith_machine","leg_press","leg_extension","leg_curl","lat_pulldown","chest_press_machine","pec_deck","treadmill","bike","elliptical","pull_up_bar"]',
 '["showers","lockers"]', true),

('Fit For Free Amsterdam Zuidoost', 'Fit For Free', 'Bijlmerdreef 101', 'Amsterdam', 'Netherlands', 52.3160, 4.9510,
 '["dumbbell","machine","cable","smith_machine","leg_press","leg_extension","leg_curl","lat_pulldown","chest_press_machine","pec_deck","treadmill","bike","elliptical","pull_up_bar"]',
 '["showers","lockers","parking"]', true),

('Fit For Free Amsterdam Noord', 'Fit For Free', 'Buikslotermeerplein 300', 'Amsterdam', 'Netherlands', 52.4000, 4.9360,
 '["dumbbell","machine","cable","smith_machine","leg_press","leg_extension","leg_curl","lat_pulldown","chest_press_machine","pec_deck","treadmill","bike","elliptical","pull_up_bar"]',
 '["showers","lockers"]', true),

('Fit For Free Amsterdam Nieuw-West', 'Fit For Free', 'Pieter Calandlaan 220', 'Amsterdam', 'Netherlands', 52.3610, 4.8170,
 '["dumbbell","machine","cable","smith_machine","leg_press","leg_extension","leg_curl","lat_pulldown","chest_press_machine","pec_deck","treadmill","bike","elliptical","pull_up_bar"]',
 '["showers","lockers"]', true);

-- ═══════════════════════════════════════════
-- INDEPENDENT / SPECIALTY GYMS (~6 locations)
-- Equipment: varies by gym
-- ═══════════════════════════════════════════

INSERT INTO gyms (name, chain, address, city, country, latitude, longitude, equipment, amenities, verified) VALUES
('Warehouse Gym Amsterdam', NULL, 'Isolatorweg 28', 'Amsterdam', 'Netherlands', 52.3870, 4.8320,
 '["barbell","dumbbell","kettlebell","ez_bar","trap_bar","machine","cable","leg_press","hack_squat","power_rack","bumper_plates","competition_bench","glute_ham_raise","reverse_hyper","belt_squat","pull_up_bar","dip_station","roman_chair","ab_wheel","resistance_bands"]',
 '["showers","lockers","parking"]', true),

('Iron Gym Amsterdam', NULL, 'Molukkenstraat 200', 'Amsterdam', 'Netherlands', 52.3610, 4.9380,
 '["barbell","dumbbell","kettlebell","ez_bar","trap_bar","machine","cable","smith_machine","leg_press","hack_squat","power_rack","bumper_plates","competition_bench","pull_up_bar","dip_station","roman_chair"]',
 '["showers","lockers"]', true),

('Muscle Beach Amsterdam', NULL, 'NDSM-Plein 28', 'Amsterdam', 'Netherlands', 52.4010, 4.8940,
 '["barbell","dumbbell","kettlebell","ez_bar","machine","cable","smith_machine","leg_press","hack_squat","leg_extension","leg_curl","lat_pulldown","chest_press_machine","pec_deck","hip_thrust_machine","calf_raise_machine","power_rack","bumper_plates","competition_bench","treadmill","bike","rowing_machine","pull_up_bar","dip_station","roman_chair","ab_wheel"]',
 '["showers","lockers","towels","sauna"]', true),

('The Gym Amsterdam Jordaan', NULL, 'Elandsgracht 29', 'Amsterdam', 'Netherlands', 52.3700, 4.8830,
 '["barbell","dumbbell","kettlebell","machine","cable","smith_machine","leg_press","leg_extension","leg_curl","lat_pulldown","chest_press_machine","power_rack","treadmill","bike","rowing_machine","elliptical","pull_up_bar","dip_station","swiss_ball","resistance_bands"]',
 '["showers","lockers","classes"]', true),

('ClimbFit Amsterdam', NULL, 'Naritaweg 48', 'Amsterdam', 'Netherlands', 52.3880, 4.8370,
 '["barbell","dumbbell","kettlebell","pull_up_bar","dip_station","resistance_bands","power_rack","bumper_plates","treadmill","rowing_machine","ab_wheel","swiss_ball"]',
 '["showers","lockers","classes","parking"]', true),

('Zuidpool Fitness', NULL, 'Europaboulevard 2', 'Amsterdam', 'Netherlands', 52.3360, 4.8910,
 '["barbell","dumbbell","kettlebell","ez_bar","machine","cable","smith_machine","leg_press","hack_squat","leg_extension","leg_curl","lat_pulldown","chest_press_machine","pec_deck","hip_thrust_machine","calf_raise_machine","power_rack","bumper_plates","treadmill","bike","rowing_machine","stairmaster","elliptical","pull_up_bar","dip_station","roman_chair","ab_wheel","swiss_ball","resistance_bands"]',
 '["showers","lockers","towels","sauna","classes","wifi","parking"]', true);
