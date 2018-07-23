DROP TABLE IF EXISTS tokens CASCADE;
DROP TABLE IF EXISTS voters CASCADE;

CREATE TABLE tokens (
  id               SERIAL PRIMARY KEY,
  name             TEXT      NOT NULL UNIQUE,
  description      TEXT      NULL     DEFAULT NULL,
  price            text      NULL     DEFAULT NULL,
  icon             text      null     default null,
  active           boolean            default true,
  coinmarketcap_id INT       NOT NULL,
  created_at       TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at       TIMESTAMP          DEFAULT NULL
);

INSERT INTO tokens (id, name, description, price, icon, created_at, coinmarketcap_id)
VALUES
  (1, 'iExec RLC', 'RLC', null, '/img/RLC.png', NOW(), 1637),
  (2, 'OmiseGo', 'OMG', null, '/img/OMG.png', NOW(), 1808),
  (3, 'Golem', 'GNT', null, '/img/GNT.png', NOW(), 1455),
  (4, 'ZRX', 'ZRX', null, '/img/ZRX.png', NOW(), 1896),
  (5, 'Augur', 'REP', null, '/img/REP.png', NOW(), 1104),
  (6, 'Zilliqa', 'ZIL', null, '/img/ZIL.png', NOW(), 2469),
  (7, 'KyberNetwork', 'KNC', null, '/img/KNC.png', NOW(), 1982),
  (8, 'Bancor', 'BNT', null, '/img/BNT.png', NOW(), 1727),
  (9, 'Enjin', 'ENJ', null, '/img/ENJ.png', NOW(), 2130),
  (10, 'Mith.io', 'MITH', null, '/img/MITH.png', NOW(), 2608),
  (11, 'Theta', 'THETA', null, '/img/THETA.png', NOW(), 2416),
  (12, 'Cortex', 'CTXC', null, '/img/CTXC.png', NOW(), 2638),
  (13, 'Dentacoin', 'DCN', null, '/img/DCN.png', NOW(), 1876);

CREATE TABLE votes (
  id               SERIAL PRIMARY KEY,
  address          TEXT      NOT NULL UNIQUE,
  auth_information JSONB     NOT NULL,
  token_id         INT REFERENCES tokens (id),
  wct_balance      INT                DEFAULT 0,
  created_at       TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at       TIMESTAMP          DEFAULT NULL
);



CREATE OR REPLACE VIEW view_votes AS
  SELECT
    id,
    address,
    auth_information,
    token_id,
    wct_balance / 100 as wct_balance,
    DATE_PART('epoch', created_at) :: INT AS created_at,
    DATE_PART('epoch', updated_at) :: INT AS updated_at
  FROM votes;


CREATE OR REPLACE VIEW view_tokens AS
  SELECT
    id,
    name,
    description,
    price,
    icon,
    coinmarketcap_id,
    DATE_PART('epoch', created_at) :: INT AS created_at,
    DATE_PART('epoch', updated_at) :: INT AS updated_at,
    (SELECT COUNT(id)
     FROM votes
     WHERE token_id = tokens.id)          AS votes_count,
    COALESCE(((SELECT SUM(wct_balance) / 100
               FROM votes
               WHERE token_id = tokens.id) / (SELECT CASE WHEN SUM(wct_balance) = 0
      THEN 1
                                                     ELSE SUM(wct_balance) / 100 END
                                              FROM votes)) * 100, 0
    )                                     AS wct_share,
    (SELECT SUM (wct_balance) / 100 FROM votes
    WHERE token_id = tokens.id)wct_amount
  FROM tokens
  WHERE active = TRUE;


CREATE TABLE log_requests (
  id                   SERIAL PRIMARY KEY,
  body                 TEXT      NULL,
  body_json            JSONB     NULL,
  address              TEXT      NULL,
  method               TEXT      NULL,
  class                TEXT      NULL,
  args                 JSONB     NULL,
  method_name          TEXT      NULL,
  headers              JSONB     NULL,
  response_http_status TEXT      NULL,
  time                 TIMESTAMP NULL,
  db_query             JSONB     NULL,
  exception_text       TEXT      NULL,
  exception_trace      TEXT      NULL,
  exception_file       TEXT      NULL,
  exception_line       TEXT      NULL,
  created_at           TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at           TIMESTAMP          DEFAULT NULL
);
