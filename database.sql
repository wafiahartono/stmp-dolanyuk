-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: Jan 05, 2024 at 10:47 AM
-- Server version: 8.0.35-0ubuntu0.22.04.1
-- PHP Version: 7.4.33

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `react_160419098`
--

-- --------------------------------------------------------

--
-- Table structure for table `dolanyuk_chats`
--

CREATE TABLE `dolanyuk_chats` (
  `id` bigint UNSIGNED NOT NULL,
  `event` bigint UNSIGNED NOT NULL,
  `timestamp` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `user` bigint UNSIGNED NOT NULL,
  `text` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `dolanyuk_events`
--

CREATE TABLE `dolanyuk_events` (
  `id` bigint UNSIGNED NOT NULL,
  `game` bigint UNSIGNED NOT NULL,
  `title` varchar(100) NOT NULL,
  `datetime` datetime NOT NULL,
  `location` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `dolanyuk_games`
--

CREATE TABLE `dolanyuk_games` (
  `id` bigint UNSIGNED NOT NULL,
  `name` varchar(100) NOT NULL,
  `min_players` tinyint UNSIGNED NOT NULL,
  `image` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `dolanyuk_games`
--

INSERT INTO `dolanyuk_games` (`id`, `name`, `min_players`, `image`) VALUES
(1, 'Monopoly', 2, NULL),
(2, 'Settlers of Catan', 3, NULL),
(3, 'Ticket to Ride', 2, NULL),
(4, 'Risk', 2, NULL),
(5, 'Carcassonne', 2, NULL),
(6, 'Pandemic', 2, NULL),
(7, 'Chess', 2, NULL),
(8, 'Scrabble', 2, NULL),
(9, 'Clue', 3, NULL),
(10, 'Codenames', 4, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `dolanyuk_participants`
--

CREATE TABLE `dolanyuk_participants` (
  `id` bigint UNSIGNED NOT NULL,
  `event` bigint UNSIGNED NOT NULL,
  `user` bigint UNSIGNED NOT NULL,
  `joined_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `dolanyuk_users`
--

CREATE TABLE `dolanyuk_users` (
  `id` bigint UNSIGNED NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(100) NOT NULL,
  `name` varchar(100) NOT NULL,
  `picture` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `dolanyuk_chats`
--
ALTER TABLE `dolanyuk_chats`
  ADD PRIMARY KEY (`id`),
  ADD KEY `event` (`event`),
  ADD KEY `user` (`user`);

--
-- Indexes for table `dolanyuk_events`
--
ALTER TABLE `dolanyuk_events`
  ADD PRIMARY KEY (`id`),
  ADD KEY `game` (`game`);

--
-- Indexes for table `dolanyuk_games`
--
ALTER TABLE `dolanyuk_games`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `dolanyuk_participants`
--
ALTER TABLE `dolanyuk_participants`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `event` (`event`,`user`),
  ADD KEY `user` (`user`);

--
-- Indexes for table `dolanyuk_users`
--
ALTER TABLE `dolanyuk_users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `dolanyuk_chats`
--
ALTER TABLE `dolanyuk_chats`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `dolanyuk_events`
--
ALTER TABLE `dolanyuk_events`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `dolanyuk_games`
--
ALTER TABLE `dolanyuk_games`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `dolanyuk_participants`
--
ALTER TABLE `dolanyuk_participants`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `dolanyuk_users`
--
ALTER TABLE `dolanyuk_users`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `dolanyuk_chats`
--
ALTER TABLE `dolanyuk_chats`
  ADD CONSTRAINT `dolanyuk_chats_ibfk_1` FOREIGN KEY (`event`) REFERENCES `dolanyuk_events` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  ADD CONSTRAINT `dolanyuk_chats_ibfk_2` FOREIGN KEY (`user`) REFERENCES `dolanyuk_users` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

--
-- Constraints for table `dolanyuk_events`
--
ALTER TABLE `dolanyuk_events`
  ADD CONSTRAINT `dolanyuk_events_ibfk_1` FOREIGN KEY (`game`) REFERENCES `dolanyuk_games` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

--
-- Constraints for table `dolanyuk_participants`
--
ALTER TABLE `dolanyuk_participants`
  ADD CONSTRAINT `dolanyuk_participants_ibfk_1` FOREIGN KEY (`event`) REFERENCES `dolanyuk_events` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  ADD CONSTRAINT `dolanyuk_participants_ibfk_2` FOREIGN KEY (`user`) REFERENCES `dolanyuk_users` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
