-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jul 11, 2023 at 10:28 AM
-- Server version: 10.4.27-MariaDB
-- PHP Version: 8.2.0

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `crowdfunding`
--

-- --------------------------------------------------------

--
-- Table structure for table `admin`
--

CREATE TABLE `admin` (
  `id` int(11) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `last_signin_time` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `admin`
--

INSERT INTO `admin` (`id`, `email`, `password`, `last_signin_time`) VALUES
(1, 'admin@crowdfund.com', '2', 'Mon Feb 06 2023 22:44:03 GMT+0500 (Pakistan Standard Time)');

-- --------------------------------------------------------

--
-- Table structure for table `cards`
--

CREATE TABLE `cards` (
  `id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `account_title` varchar(255) NOT NULL,
  `card_number` varchar(16) NOT NULL,
  `cvc` varchar(4) NOT NULL,
  `card_expiry` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `challenges`
--

CREATE TABLE `challenges` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `category` varchar(255) NOT NULL,
  `region` varchar(255) NOT NULL,
  `title` varchar(255) NOT NULL,
  `amount` int(11) NOT NULL,
  `description` text NOT NULL,
  `image` varchar(255) DEFAULT NULL,
  `post_time` datetime DEFAULT current_timestamp(),
  `donated_amount` int(11) NOT NULL DEFAULT 0,
  `rating` int(11) NOT NULL,
  `authenticated_by` int(11) NOT NULL,
  `is_completed` int(11) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `challenges`
--

INSERT INTO `challenges` (`id`, `user_id`, `category`, `region`, `title`, `amount`, `description`, `image`, `post_time`, `donated_amount`, `rating`, `authenticated_by`, `is_completed`) VALUES
(4, 13, 'health', 'lahore', 'heheeadadad', 1222222, 'asdasdasbdasbdhbashdasd  ashd asb dhasd asdasn daskj das dhas d', 'heheeadadad-WhatsApp Image 2023-03-30 at 9.56.05 AM (2).jpeg', '2023-04-11 21:33:43', 10009, 45, 10, 0),
(8, 10, 'health', 'sialkot', 'hello', 1000, 'Hello this is a test', 'hello-fiverr6.png', '2023-04-26 15:13:07', 20615, 15, 4, 1),
(10, 13, 'education', 'faisalabad', 'nomi', 1000, 'i need help', 'nomi-logo (3).png', '2023-04-26 15:31:54', 0, 4, 2, 0),
(14, 11, 'education', 'sialkot', 'Donation amount needed for school fee of my children ', 200, 'I am an electrician and a father of 4 children we live on rental apartment and it is hard for me to pay fess', 'Donation amount needed for school fee of my children -feechalan.jpg', '2023-04-27 20:26:36', 200, 0, 0, 1),
(15, 1, 'education', 'quetta', '3000', 0, 'sfgf9fi0q', 'aaa-debt.jpg', '2023-04-28 15:11:32', 2800, 0, 0, 1),
(16, 5, 'education', 'quetta', '1200', 0, 'BLABLABLA', 'TEST12-debt.jpg', '2023-04-28 15:14:07', 13500, 45, 10, 1),
(17, 13, 'environment', 'peshawar', 'need money to pay my debt', 400, 'testing', 'need money to pay my debt-feechalan.jpg', '2023-04-28 18:15:21', 400, 4, 1, 1),
(22, 28, 'emergency', 'islamabad', 'money needed for rent', 1500, 'money need for rent', 'money needed for rent-Screenshot (3).png', '2023-07-10 17:41:24', 760, 3, 1, 0),
(23, 0, 'emergency', 'islamabad', 'money needed for rent', 500, 'abc', 'money needed for rent-Screenshot (1).png', '2023-07-11 11:27:53', 0, 0, 0, 0),
(24, 28, 'emergency', 'islamabad', 'need money for rent', 2000, 'avbc', 'need money for rent-Screenshot (2).png', '2023-07-11 11:35:36', 0, 0, 0, 0);

-- --------------------------------------------------------

--
-- Table structure for table `temp_challenges`
--

CREATE TABLE `temp_challenges` (
  `id` int(11) NOT NULL,
  `category` varchar(255) NOT NULL,
  `region` varchar(255) NOT NULL,
  `title` varchar(255) NOT NULL,
  `amount` int(11) NOT NULL,
  `description` text NOT NULL,
  `image` varchar(255) DEFAULT NULL,
  `post_time` datetime DEFAULT current_timestamp(),
  `is_completed` int(11) NOT NULL DEFAULT 0,
  `user_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `temp_challenges`
--

INSERT INTO `temp_challenges` (`id`, `category`, `region`, `title`, `amount`, `description`, `image`, `post_time`, `is_completed`, `user_id`) VALUES
(17, 'health', 'peshawar', 'need money to pay my debt', 600, 'test12', 'need money to pay my debt-debt.jpg', '2023-04-28 18:17:09', 0, 13),
(23, 'emergency', 'karachi', 'need money for phone', 2000, 'abc', 'need money for phone-Screenshot (277).png', '2023-07-10 17:47:14', 0, 28);

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `phoneNo` varchar(255) NOT NULL,
  `CNIC` varchar(255) NOT NULL,
  `ntn` varchar(255) NOT NULL,
  `roll` varchar(255) NOT NULL,
  `active` int(11) NOT NULL,
  `card_id` varchar(255) NOT NULL,
  `balance` int(11) NOT NULL DEFAULT 0,
  `account_id` varchar(255) NOT NULL,
  `customer_id` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `email`, `password`, `name`, `phoneNo`, `CNIC`, `ntn`, `roll`, `active`, `card_id`, `balance`, `account_id`, `customer_id`) VALUES
(7, 'test123@gmail.com', '0', 'sir', '03355786970', '', '', 'DONOR', 1, '4242424242424242', 0, '', 'cus_NmzzkcVaQQjqVE'),
(8, 'test1111@gmail.com', '0', 'shamoon', '03345786970', '', '', 'DONOR', 1, '', 0, '', 'cus_O9s4Y9s3cnWIUd'),
(10, 'test12345@gmail.com', '10ap2001', 'shamoon', '03355786970', '3740554592961', '', 'DONOR', 1, '', 500, '', 'cus_Nn0xSNtdo6U45v'),
(12, 'donor@gmail.com', '12345678', 'Donor', '03345786970', '3740554592961', '', 'DONOR', 1, '', 0, '', 'cus_Nn712w8w0vrQlR'),
(13, 'receiver@gmail.com', '1', 'Receiver', '03355786970', '3740554582962', '', 'RECIEVER', 1, 'card_1NNeUERTuk4HqdyoRpJkXZKI', 3000, 'acct_1NNeTNRTuk4Hqdyo', ''),
(26, 'lol@gmail.com', '15e2b0d3c33891ebb0f1ef609ec419420c20e320ce94c65fbc8c3312448eb225', 'lol', '1234567890', '1111111111111111', '1234567', 'RECIEVER', 1, '', 0, '', ''),
(28, 'abc@gmail.com', '8bb0cf6eb9b17d0f7d22b456f121257dc1254e1f01665370476383ea776df414', 'Shamoon', '12345678', '1234567', '1234567', 'RECIEVER', 1, '', 760, '', ''),
(29, 'mahnoor@gmail.com', '8bb0cf6eb9b17d0f7d22b456f121257dc1254e1f01665370476383ea776df414', 'Mahnoor', '7654321', '12345678', '', 'DONOR', 1, '', 0, '', 'cus_OEnFaYKVs0ybLL');

-- --------------------------------------------------------

--
-- Table structure for table `user_challenges`
--

CREATE TABLE `user_challenges` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `challenge_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `user_challenges`
--

INSERT INTO `user_challenges` (`id`, `user_id`, `challenge_id`) VALUES
(12, 7, 4),
(16, 10, 10),
(20, 12, 15),
(24, 8, 8),
(25, 29, 22);

-- --------------------------------------------------------

--
-- Table structure for table `user_donations`
--

CREATE TABLE `user_donations` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `challenge_id` int(11) NOT NULL,
  `donated_amount` int(11) NOT NULL DEFAULT 0,
  `message` text NOT NULL DEFAULT 'No Message',
  `individual_rating` int(1) DEFAULT NULL,
  `date_of_donation` date NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `user_donations`
--

INSERT INTO `user_donations` (`id`, `user_id`, `challenge_id`, `donated_amount`, `message`, `individual_rating`, `date_of_donation`) VALUES
(1, 7, 8, 1120, '', 4, '2023-06-19'),
(2, 8, 10, 0, 'Hi b', 2, '2023-06-19'),
(3, 8, 8, 900, '', 4, '2023-06-24'),
(5, 7, 17, 400, '', 4, '2023-06-24'),
(7, 7, 10, 500, 'i\'m here hello', 2, '2023-06-26'),
(8, 7, 4, 500, 'Yo wassup nigga', 3, '2023-06-26'),
(9, 29, 22, 760, 'i am donating you ', 3, '2023-07-10');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `admin`
--
ALTER TABLE `admin`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `cards`
--
ALTER TABLE `cards`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `challenges`
--
ALTER TABLE `challenges`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `temp_challenges`
--
ALTER TABLE `temp_challenges`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `user_challenges`
--
ALTER TABLE `user_challenges`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `challenge_id` (`challenge_id`);

--
-- Indexes for table `user_donations`
--
ALTER TABLE `user_donations`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `challenge_id` (`challenge_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `admin`
--
ALTER TABLE `admin`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `cards`
--
ALTER TABLE `cards`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `challenges`
--
ALTER TABLE `challenges`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=25;

--
-- AUTO_INCREMENT for table `temp_challenges`
--
ALTER TABLE `temp_challenges`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=25;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=30;

--
-- AUTO_INCREMENT for table `user_challenges`
--
ALTER TABLE `user_challenges`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=26;

--
-- AUTO_INCREMENT for table `user_donations`
--
ALTER TABLE `user_donations`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `cards`
--
ALTER TABLE `cards`
  ADD CONSTRAINT `cards_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

--
-- Constraints for table `temp_challenges`
--
ALTER TABLE `temp_challenges`
  ADD CONSTRAINT `temp_challenges_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

--
-- Constraints for table `user_challenges`
--
ALTER TABLE `user_challenges`
  ADD CONSTRAINT `user_challenges_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `user_challenges_ibfk_2` FOREIGN KEY (`challenge_id`) REFERENCES `challenges` (`id`);

--
-- Constraints for table `user_donations`
--
ALTER TABLE `user_donations`
  ADD CONSTRAINT `user_donations_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `user_donations_ibfk_2` FOREIGN KEY (`challenge_id`) REFERENCES `challenges` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
