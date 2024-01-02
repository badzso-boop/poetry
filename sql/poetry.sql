-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Gép: 127.0.0.1
-- Létrehozás ideje: 2024. Jan 03. 00:43
-- Kiszolgáló verziója: 10.4.25-MariaDB
-- PHP verzió: 8.1.10

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Adatbázis: `poetry`
--
CREATE DATABASE IF NOT EXISTS `poetry` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE `poetry`;

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `albums`
--

CREATE TABLE `albums` (
  `album_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `creation_date` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- A tábla adatainak kiíratása `albums`
--

INSERT INTO `albums` (`album_id`, `user_id`, `title`, `description`, `creation_date`) VALUES
(1, 5, 'Az én albumom', 'Ez az album tartalmazza a kedvenc verseimet.', '2023-12-30 18:34:37'),
(5, 5, 'Az én 2. albumom', 'Ez az album tartalmazza a kedvenc verseimet.', '2023-12-31 13:24:07'),
(11, 10, 'Saját', 'ez egy próba leírás a sajáthoz', '2024-01-02 22:03:02');

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `album_poems`
--

CREATE TABLE `album_poems` (
  `album_id` int(11) NOT NULL,
  `poem_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- A tábla adatainak kiíratása `album_poems`
--

INSERT INTO `album_poems` (`album_id`, `poem_id`) VALUES
(1, 3),
(1, 6),
(1, 7),
(5, 9),
(5, 10),
(5, 11),
(11, 14);

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `comments`
--

CREATE TABLE `comments` (
  `comment_id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `poem_id` int(11) DEFAULT NULL,
  `comment_text` text NOT NULL,
  `date_commented` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- A tábla adatainak kiíratása `comments`
--

INSERT INTO `comments` (`comment_id`, `user_id`, `poem_id`, `comment_text`, `date_commented`) VALUES
(1, 1, 3, 'Great poem!', '2023-12-29 22:42:22'),
(2, 1, 3, 'I love this!', '2023-12-29 22:42:22'),
(3, 1, 3, 'Beautifully written.', '2023-12-29 22:42:22'),
(4, 1, 3, 'Deep thoughts.', '2023-12-29 22:42:22'),
(5, 1, 3, 'Fantastic work.', '2023-12-29 22:42:22'),
(6, 9, 11, 'Amazing work!', '2023-12-29 22:42:32'),
(7, 9, 11, 'This is outstanding.', '2023-12-29 22:42:32'),
(8, 9, 11, 'Im impressed!', '2023-12-29 22:42:32'),
(9, 9, 11, 'Well done!', '2023-12-29 22:42:32'),
(10, 9, 11, 'Captivating.', '2023-12-29 22:42:32'),
(13, 5, 3, 'Ez Egy uj komment', '2023-12-30 14:13:22');

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `follows`
--

CREATE TABLE `follows` (
  `follow_id` int(11) NOT NULL,
  `follower_id` int(11) DEFAULT NULL,
  `followed_id` int(11) DEFAULT NULL,
  `date_followed` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- A tábla adatainak kiíratása `follows`
--

INSERT INTO `follows` (`follow_id`, `follower_id`, `followed_id`, `date_followed`) VALUES
(1, 5, 1, '2023-12-30 14:43:17'),
(3, 5, 4, '2023-12-30 14:48:40'),
(4, 5, 9, '2023-12-30 14:48:47');

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `images`
--

CREATE TABLE `images` (
  `image_id` int(11) NOT NULL,
  `poem_id` int(11) DEFAULT NULL,
  `user_id` int(11) DEFAULT NULL,
  `image_url` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `likes`
--

CREATE TABLE `likes` (
  `like_id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `poem_id` int(11) DEFAULT NULL,
  `date_liked` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- A tábla adatainak kiíratása `likes`
--

INSERT INTO `likes` (`like_id`, `user_id`, `poem_id`, `date_liked`) VALUES
(1, 1, 3, '2023-12-29 22:46:53'),
(2, 4, 3, '2023-12-29 22:46:53'),
(3, 5, 3, '2023-12-29 22:46:53'),
(4, 9, 3, '2023-12-29 22:46:53'),
(5, 1, 11, '2023-12-29 22:46:53'),
(6, 9, 11, '2023-12-29 22:46:53'),
(7, 5, 7, '2023-12-29 23:18:26');

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `poems`
--

CREATE TABLE `poems` (
  `poem_id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `content` text NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `creation_date` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- A tábla adatainak kiíratása `poems`
--

INSERT INTO `poems` (`poem_id`, `title`, `content`, `user_id`, `creation_date`) VALUES
(3, 'Cim', 'Elso versem', 5, '2023-12-28 22:02:22'),
(6, 'Nature', 'The beauty of nature...', 1, '2023-12-28 22:36:03'),
(7, 'vers', 'new_user@example.com', 5, '2023-12-28 23:10:21'),
(9, 'vers2', 'new_user@example.com2', 5, '2023-12-28 23:10:45'),
(10, 'vers3', 'new_user@example.com3', 5, '2023-12-28 23:12:19'),
(11, 'valami', 'valami', 9, '2023-12-29 00:14:30'),
(12, 'proba', 'proba', 10, '2024-01-02 20:28:24'),
(13, 'Anyad', 'ez a vers anyadrol szol', 10, '2024-01-02 20:59:02'),
(14, 'Kertem', 'Lelkem mint egy virágoskert\nMit építeni s gondozni kell\nGyakran jönnek kártékony bogarak\nDe nem törik át a védelmező falakat\n\nMinden érzelmet egy egy virág képvisel\nS kertészkent figyelek ezrivel\nSokszor jönnek látogatók\nDe általában csak átutazók\n\nEddig egy társkertészre leltem\nAzonban sajna eltessékeltem\nKertemet azóta egyedül gondozom\nS bérmunkásokat néha osztozom', 10, '2024-01-02 22:02:49');

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `users`
--

CREATE TABLE `users` (
  `user_id` int(11) NOT NULL,
  `username` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `profile_image_url` varchar(255) DEFAULT NULL,
  `role` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- A tábla adatainak kiíratása `users`
--

INSERT INTO `users` (`user_id`, `username`, `email`, `password_hash`, `profile_image_url`, `role`) VALUES
(1, 'szmajli', 'norbi', 'asd', 'asd.jpg', NULL),
(4, 'updated_user', 'updated_user@example.com', 'updated_secret456', 'https://example.com/updated_user.jpg', NULL),
(5, 'new_user', '', '$2b$10$8sV/qcDhzvtA628098JY5OYHLJp51rleXCvgBQBoKTCPL0DAku/f6', NULL, 'admin'),
(9, 'szmajli10', 'norbert.ujj@gmail.com', '$2b$10$wKUi0P27fvDVYG.RqSfldOolwMlBOSBbDJvT05evqbJKoyYUNcMXC', NULL, NULL),
(10, 'anyad', 'anyad@anyad.hu', '$2b$10$7KKQcRqqy.DsFpKw10L1seL9zTH/0nZP.IpJGN6lMCVInsXI61xQW', NULL, 'user');

--
-- Indexek a kiírt táblákhoz
--

--
-- A tábla indexei `albums`
--
ALTER TABLE `albums`
  ADD PRIMARY KEY (`album_id`),
  ADD KEY `user_id` (`user_id`);

--
-- A tábla indexei `album_poems`
--
ALTER TABLE `album_poems`
  ADD PRIMARY KEY (`album_id`,`poem_id`),
  ADD KEY `poem_id` (`poem_id`);

--
-- A tábla indexei `comments`
--
ALTER TABLE `comments`
  ADD PRIMARY KEY (`comment_id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `poem_id` (`poem_id`);

--
-- A tábla indexei `follows`
--
ALTER TABLE `follows`
  ADD PRIMARY KEY (`follow_id`),
  ADD KEY `follower_id` (`follower_id`),
  ADD KEY `followed_id` (`followed_id`);

--
-- A tábla indexei `images`
--
ALTER TABLE `images`
  ADD PRIMARY KEY (`image_id`),
  ADD KEY `poem_id` (`poem_id`),
  ADD KEY `user_id` (`user_id`);

--
-- A tábla indexei `likes`
--
ALTER TABLE `likes`
  ADD PRIMARY KEY (`like_id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `poem_id` (`poem_id`);

--
-- A tábla indexei `poems`
--
ALTER TABLE `poems`
  ADD PRIMARY KEY (`poem_id`),
  ADD KEY `user_id` (`user_id`);

--
-- A tábla indexei `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`user_id`),
  ADD UNIQUE KEY `username` (`username`),
  ADD UNIQUE KEY `email` (`email`);

--
-- A kiírt táblák AUTO_INCREMENT értéke
--

--
-- AUTO_INCREMENT a táblához `albums`
--
ALTER TABLE `albums`
  MODIFY `album_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT a táblához `comments`
--
ALTER TABLE `comments`
  MODIFY `comment_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT a táblához `follows`
--
ALTER TABLE `follows`
  MODIFY `follow_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT a táblához `images`
--
ALTER TABLE `images`
  MODIFY `image_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT a táblához `likes`
--
ALTER TABLE `likes`
  MODIFY `like_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT a táblához `poems`
--
ALTER TABLE `poems`
  MODIFY `poem_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT a táblához `users`
--
ALTER TABLE `users`
  MODIFY `user_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- Megkötések a kiírt táblákhoz
--

--
-- Megkötések a táblához `albums`
--
ALTER TABLE `albums`
  ADD CONSTRAINT `albums_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE;

--
-- Megkötések a táblához `album_poems`
--
ALTER TABLE `album_poems`
  ADD CONSTRAINT `album_poems_ibfk_1` FOREIGN KEY (`album_id`) REFERENCES `albums` (`album_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `album_poems_ibfk_2` FOREIGN KEY (`poem_id`) REFERENCES `poems` (`poem_id`) ON DELETE CASCADE;

--
-- Megkötések a táblához `comments`
--
ALTER TABLE `comments`
  ADD CONSTRAINT `comments_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`),
  ADD CONSTRAINT `comments_ibfk_2` FOREIGN KEY (`poem_id`) REFERENCES `poems` (`poem_id`);

--
-- Megkötések a táblához `follows`
--
ALTER TABLE `follows`
  ADD CONSTRAINT `follows_ibfk_1` FOREIGN KEY (`follower_id`) REFERENCES `users` (`user_id`),
  ADD CONSTRAINT `follows_ibfk_2` FOREIGN KEY (`followed_id`) REFERENCES `users` (`user_id`);

--
-- Megkötések a táblához `images`
--
ALTER TABLE `images`
  ADD CONSTRAINT `images_ibfk_1` FOREIGN KEY (`poem_id`) REFERENCES `poems` (`poem_id`),
  ADD CONSTRAINT `images_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`);

--
-- Megkötések a táblához `likes`
--
ALTER TABLE `likes`
  ADD CONSTRAINT `likes_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`),
  ADD CONSTRAINT `likes_ibfk_2` FOREIGN KEY (`poem_id`) REFERENCES `poems` (`poem_id`);

--
-- Megkötések a táblához `poems`
--
ALTER TABLE `poems`
  ADD CONSTRAINT `poems_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
