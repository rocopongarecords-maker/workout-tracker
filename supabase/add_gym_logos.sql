-- Add logo_url column to gyms table
-- Run this AFTER gym_schema.sql and seed_amsterdam_gyms.sql

ALTER TABLE gyms ADD COLUMN IF NOT EXISTS logo_url TEXT;

-- ═══════════════════════════════════════════
-- Update logos for each chain
-- Using publicly available brand logos
-- ═══════════════════════════════════════════

-- Basic-Fit
UPDATE gyms SET logo_url = 'https://logo.clearbit.com/basic-fit.com'
WHERE chain = 'Basic-Fit';

-- TrainMore
UPDATE gyms SET logo_url = 'https://logo.clearbit.com/trainmore.nl'
WHERE chain = 'TrainMore';

-- Vondelgym
UPDATE gyms SET logo_url = 'https://logo.clearbit.com/vondelgym.nl'
WHERE chain = 'Vondelgym';

-- SportCity
UPDATE gyms SET logo_url = 'https://logo.clearbit.com/sportcity.nl'
WHERE chain = 'SportCity';

-- CrossFit
UPDATE gyms SET logo_url = 'https://logo.clearbit.com/crossfit.com'
WHERE chain = 'CrossFit';

-- Fit For Free
UPDATE gyms SET logo_url = 'https://logo.clearbit.com/fitforfree.nl'
WHERE chain = 'Fit For Free';

-- Independent gyms
UPDATE gyms SET logo_url = 'https://logo.clearbit.com/warehousegym.nl'
WHERE name = 'Warehouse Gym Amsterdam';

UPDATE gyms SET logo_url = 'https://logo.clearbit.com/irongym.nl'
WHERE name = 'Iron Gym Amsterdam';

UPDATE gyms SET logo_url = 'https://logo.clearbit.com/musclebeach.nl'
WHERE name = 'Muscle Beach Amsterdam';

UPDATE gyms SET logo_url = 'https://logo.clearbit.com/thegym.nl'
WHERE name = 'The Gym Amsterdam Jordaan';

UPDATE gyms SET logo_url = 'https://logo.clearbit.com/climbfit.nl'
WHERE name = 'ClimbFit Amsterdam';

UPDATE gyms SET logo_url = 'https://logo.clearbit.com/zuidpool.nl'
WHERE name = 'Zuidpool Fitness';
