-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Oct 23, 2026 at 11:37 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `watchwebsite`
--

-- --------------------------------------------------------

--
-- Table structure for table `blogs`
--

CREATE TABLE `blogs` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `category_id` bigint(20) UNSIGNED DEFAULT NULL,
  `title` varchar(255) NOT NULL,
  `slug` varchar(255) NOT NULL,
  `description` longtext NOT NULL,
  `status` enum('draft','published','archived') NOT NULL DEFAULT 'draft',
  `featured_image` varchar(255) DEFAULT NULL,
  `images` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`images`)),
  `meta_title` varchar(255) DEFAULT NULL,
  `meta_description` text DEFAULT NULL,
  `meta_keywords` text DEFAULT NULL,
  `published_at` datetime(3) DEFAULT NULL,
  `author_id` bigint(20) UNSIGNED DEFAULT NULL,
  `created_at` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updated_at` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `deleted_at` datetime(3) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `blog_tag`
--

CREATE TABLE `blog_tag` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `blog_id` bigint(20) UNSIGNED NOT NULL,
  `tag_id` bigint(20) UNSIGNED NOT NULL,
  `created_at` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updated_at` datetime(3) NOT NULL DEFAULT current_timestamp(3)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `brands`
--

CREATE TABLE `brands` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(150) NOT NULL,
  `slug` varchar(180) NOT NULL,
  `description` text DEFAULT NULL,
  `logo` varchar(255) DEFAULT NULL,
  `status` tinyint(1) NOT NULL DEFAULT 0,
  `created_at` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updated_at` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `deleted_at` datetime(3) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `brands`
--

INSERT INTO `brands` (`id`, `name`, `slug`, `description`, `logo`, `status`, `created_at`, `updated_at`, `deleted_at`) VALUES
(1, 'valour', 'valour', 'valour brand watches', NULL, 1, '2026-10-23 18:36:10.069', '2026-10-23 18:36:15.354', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `carts`
--

CREATE TABLE `carts` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED DEFAULT NULL,
  `session_id` varchar(255) DEFAULT NULL,
  `status` enum('active','converted','abandoned') NOT NULL DEFAULT 'active',
  `expires_at` datetime(3) DEFAULT NULL,
  `created_at` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updated_at` datetime(3) NOT NULL DEFAULT current_timestamp(3)
) ;

-- --------------------------------------------------------

--
-- Table structure for table `cart_items`
--

CREATE TABLE `cart_items` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `cart_id` bigint(20) UNSIGNED NOT NULL,
  `product_id` bigint(20) UNSIGNED NOT NULL,
  `quantity` int(10) UNSIGNED NOT NULL DEFAULT 1,
  `options` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`options`)),
  `options_hash` char(64) NOT NULL DEFAULT '',
  `created_at` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updated_at` datetime(3) NOT NULL DEFAULT current_timestamp(3)
) ;

-- --------------------------------------------------------

--
-- Table structure for table `categories`
--

CREATE TABLE `categories` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `parent_id` bigint(20) UNSIGNED DEFAULT NULL,
  `name` varchar(150) NOT NULL,
  `slug` varchar(180) NOT NULL,
  `description` text DEFAULT NULL,
  `type` enum('blog','product') NOT NULL,
  `image` varchar(255) DEFAULT NULL,
  `status` tinyint(1) NOT NULL DEFAULT 0,
  `sort_order` int(11) NOT NULL DEFAULT 0,
  `created_at` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updated_at` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `deleted_at` datetime(3) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `categories`
--

INSERT INTO `categories` (`id`, `parent_id`, `name`, `slug`, `description`, `type`, `image`, `status`, `sort_order`, `created_at`, `updated_at`, `deleted_at`) VALUES
(1, NULL, 'blog 1', 'blog-1', 'blogs blogs blogs blogsblogs blogs blogs blogsblogs blogs blogs blogsblogs blogs blogs blogsblogs blogs blogs blogsblogs blogs blogs blogs', 'product', NULL, 0, 0, '2026-10-23 18:37:06.464', '2026-10-23 18:43:26.865', '2026-10-23 18:43:26.852');

-- --------------------------------------------------------

--
-- Table structure for table `cms_pages`
--

CREATE TABLE `cms_pages` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `page_title` varchar(255) NOT NULL,
  `page_slug` varchar(255) NOT NULL,
  `page_meta_title` varchar(255) DEFAULT NULL,
  `page_meta_description` text DEFAULT NULL,
  `status` enum('draft','published') NOT NULL DEFAULT 'draft',
  `published_at` datetime(3) DEFAULT NULL,
  `created_at` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updated_at` datetime(3) NOT NULL DEFAULT current_timestamp(3)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `cms_page_sections`
--

CREATE TABLE `cms_page_sections` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `cms_page_id` bigint(20) UNSIGNED NOT NULL,
  `section_name` varchar(150) NOT NULL,
  `section_type` varchar(100) NOT NULL,
  `section_sort_order` int(10) UNSIGNED NOT NULL DEFAULT 0,
  `created_at` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updated_at` datetime(3) NOT NULL DEFAULT current_timestamp(3)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `cms_page_section_fields`
--

CREATE TABLE `cms_page_section_fields` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `cms_page_section_id` bigint(20) UNSIGNED NOT NULL,
  `field_group` varchar(100) NOT NULL DEFAULT '',
  `field_name` varchar(150) NOT NULL,
  `field_type` varchar(50) NOT NULL,
  `field_value` longtext DEFAULT NULL,
  `field_options` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`field_options`)),
  `created_at` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updated_at` datetime(3) NOT NULL DEFAULT current_timestamp(3)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `contact_inquiries`
--

CREATE TABLE `contact_inquiries` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(150) NOT NULL,
  `email` varchar(255) NOT NULL,
  `phone` varchar(30) DEFAULT NULL,
  `subject` varchar(255) DEFAULT NULL,
  `message` text NOT NULL,
  `type` varchar(50) NOT NULL DEFAULT 'contact',
  `extra_data` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`extra_data`)),
  `is_read` tinyint(1) NOT NULL DEFAULT 0,
  `is_replied` tinyint(1) NOT NULL DEFAULT 0,
  `reply_message` text DEFAULT NULL,
  `replied_at` datetime(3) DEFAULT NULL,
  `created_at` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updated_at` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `deleted_at` datetime(3) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `coupons`
--

CREATE TABLE `coupons` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `code` varchar(100) NOT NULL,
  `type` enum('fixed','percentage') NOT NULL,
  `value` decimal(12,2) NOT NULL,
  `min_order_amount` decimal(12,2) NOT NULL DEFAULT 0.00,
  `max_discount` decimal(12,2) DEFAULT NULL,
  `usage_limit` int(10) UNSIGNED DEFAULT NULL,
  `used_count` int(10) UNSIGNED NOT NULL DEFAULT 0,
  `starts_at` datetime(3) DEFAULT NULL,
  `expires_at` datetime(3) DEFAULT NULL,
  `status` tinyint(1) NOT NULL DEFAULT 0,
  `created_at` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updated_at` datetime(3) NOT NULL DEFAULT current_timestamp(3)
) ;

-- --------------------------------------------------------

--
-- Table structure for table `customizer_options`
--

CREATE TABLE `customizer_options` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `part` enum('case','dial','strap') NOT NULL,
  `option_key` varchar(50) NOT NULL,
  `name` varchar(100) NOT NULL,
  `image` varchar(255) NOT NULL,
  `sort_order` int(11) NOT NULL DEFAULT 0,
  `status` enum('draft','active','inactive') NOT NULL DEFAULT 'draft',
  `is_default` tinyint(1) NOT NULL DEFAULT 0,
  `created_at` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updated_at` datetime(3) NOT NULL DEFAULT current_timestamp(3)
) ;

-- --------------------------------------------------------

--
-- Table structure for table `general_settings`
--

CREATE TABLE `general_settings` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `key` varchar(150) NOT NULL,
  `type` varchar(50) NOT NULL,
  `value` longtext DEFAULT NULL,
  `field_options` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`field_options`)),
  `is_public` tinyint(1) NOT NULL DEFAULT 0,
  `created_at` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updated_at` datetime(3) NOT NULL DEFAULT current_timestamp(3)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `general_settings`
--

INSERT INTO `general_settings` (`id`, `key`, `type`, `value`, `field_options`, `is_public`, `created_at`, `updated_at`) VALUES
(1, 'admin_role_ids', 'json', '[\"1\"]', NULL, 0, '2026-10-22 19:43:47.983', '2026-10-22 19:43:47.983');

-- --------------------------------------------------------

--
-- Table structure for table `newsletters`
--

CREATE TABLE `newsletters` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `email` varchar(255) NOT NULL,
  `is_subscribed` tinyint(1) NOT NULL DEFAULT 0,
  `subscribed_at` datetime(3) DEFAULT NULL,
  `consent_at` datetime(3) NOT NULL,
  `consent_source` varchar(50) NOT NULL,
  `unsubscribed_at` datetime(3) DEFAULT NULL,
  `created_at` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updated_at` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `deleted_at` datetime(3) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `orders`
--

CREATE TABLE `orders` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED DEFAULT NULL,
  `order_number` varchar(50) NOT NULL,
  `billing_details` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(`billing_details`)),
  `shipping_details` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(`shipping_details`)),
  `shipping_method` varchar(100) DEFAULT NULL,
  `shipping_amount` decimal(12,2) NOT NULL DEFAULT 0.00,
  `discount` decimal(12,2) NOT NULL DEFAULT 0.00,
  `subtotal` decimal(12,2) NOT NULL,
  `tax_amount` decimal(12,2) NOT NULL DEFAULT 0.00,
  `total` decimal(12,2) NOT NULL,
  `currency` char(3) NOT NULL,
  `status` enum('pending','confirmed','processing','shipped','delivered','cancelled') NOT NULL DEFAULT 'pending',
  `payment_status` enum('pending','paid','failed','refunded') NOT NULL DEFAULT 'pending',
  `payment_method` varchar(100) DEFAULT NULL,
  `payment_reference` varchar(255) DEFAULT NULL,
  `notes` text DEFAULT NULL,
  `checkout_token` varchar(64) DEFAULT NULL,
  `coupon_code` varchar(100) DEFAULT NULL,
  `coupon_released_at` datetime(3) DEFAULT NULL,
  `placed_at` datetime(3) DEFAULT NULL,
  `created_at` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updated_at` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `deleted_at` datetime(3) DEFAULT NULL
) ;

-- --------------------------------------------------------

--
-- Table structure for table `order_items`
--

CREATE TABLE `order_items` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `order_id` bigint(20) UNSIGNED NOT NULL,
  `product_id` bigint(20) UNSIGNED DEFAULT NULL,
  `product_name` varchar(255) NOT NULL,
  `sku` varchar(100) DEFAULT NULL,
  `product_image` varchar(255) DEFAULT NULL,
  `price` decimal(12,2) NOT NULL,
  `quantity` int(10) UNSIGNED NOT NULL,
  `subtotal` decimal(12,2) NOT NULL,
  `discount` decimal(12,2) NOT NULL DEFAULT 0.00,
  `total` decimal(12,2) NOT NULL,
  `options` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`options`)),
  `stock_deducted` tinyint(1) NOT NULL DEFAULT 0,
  `released_quantity` int(10) UNSIGNED NOT NULL DEFAULT 0,
  `created_at` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updated_at` datetime(3) NOT NULL DEFAULT current_timestamp(3)
) ;

-- --------------------------------------------------------

--
-- Table structure for table `payments`
--

CREATE TABLE `payments` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `order_id` bigint(20) UNSIGNED NOT NULL,
  `transaction_id` varchar(255) DEFAULT NULL,
  `payment_method` varchar(100) NOT NULL,
  `amount` decimal(12,2) NOT NULL,
  `status` enum('pending','paid','failed','refunded') NOT NULL DEFAULT 'pending',
  `paid_at` datetime(3) DEFAULT NULL,
  `created_at` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updated_at` datetime(3) NOT NULL DEFAULT current_timestamp(3)
) ;

-- --------------------------------------------------------

--
-- Table structure for table `products`
--

CREATE TABLE `products` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `category_id` bigint(20) UNSIGNED DEFAULT NULL,
  `brand_id` bigint(20) UNSIGNED DEFAULT NULL,
  `name` varchar(255) NOT NULL,
  `slug` varchar(255) NOT NULL,
  `sku` varchar(100) NOT NULL,
  `short_description` text DEFAULT NULL,
  `long_description` longtext DEFAULT NULL,
  `additional_info` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`additional_info`)),
  `type` enum('watch','strap','custom') NOT NULL,
  `stock` int(10) UNSIGNED NOT NULL DEFAULT 0,
  `track_stock` tinyint(1) NOT NULL DEFAULT 0,
  `base_price` decimal(12,2) NOT NULL,
  `sale_price` decimal(12,2) DEFAULT NULL,
  `main_image` varchar(255) DEFAULT NULL,
  `images` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`images`)),
  `meta_title` varchar(255) DEFAULT NULL,
  `meta_description` text DEFAULT NULL,
  `status` enum('draft','active','inactive') NOT NULL DEFAULT 'draft',
  `is_featured` tinyint(1) NOT NULL DEFAULT 0,
  `created_at` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updated_at` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `deleted_at` datetime(3) DEFAULT NULL
) ;

--
-- Dumping data for table `products`
--

INSERT INTO `products` (`id`, `category_id`, `brand_id`, `name`, `slug`, `sku`, `short_description`, `long_description`, `additional_info`, `type`, `stock`, `track_stock`, `base_price`, `sale_price`, `main_image`, `images`, `meta_title`, `meta_description`, `status`, `is_featured`, `created_at`, `updated_at`, `deleted_at`) VALUES
(1, NULL, NULL, 'red', 'red-w', '12548', 'asdasd', 'asdasd', '{\"subtitle\":\"asdasd\",\"collection\":\"asdasd\",\"movement\":\"asdasd\",\"material\":\"asdasd\",\"tagline\":\"asdasd\",\"pdpSubtitle\":\"asdasd\",\"accent\":\"#FACC15\",\"edition\":\"asdasd\"}', 'watch', 0, 0, 1500.00, 1099.00, '/media/products/1/388b0eb02e4a1e1483211d4197847c0c.png', '[]', 'asdasd', 'asdasd', 'draft', 0, '2026-10-22 20:42:35.184', '2026-10-23 01:14:56.596', NULL),
(2, NULL, NULL, 'Frost Silver', 'frost-silver', 'LUC-03', NULL, 'The Frost Silver embodies the spirit of exploration and optimism, combining contemporary design with dependable Swiss-inspired craftsmanship.\n\nBuilt with a lightweight titanium case and powered by a precision automatic movement, it delivers exceptional reliability and smooth performance for every occasion.Designed for modern lifestyles, Frost Silver balances bold aesthetics with everyday practicality.\n\nDistinctive, versatile, and unmistakably Valour—Frost Silver is made for those who move forward with confidence.', '{\"media\":{\"hero\":\"/media/products/2/874ab8e41609aa477028b916d90419dc.jpg\",\"parallax1\":\"/media/products/2/a59748dea3c8768ae2a786ee8277d824.jpg\",\"parallax2\":\"/media/products/2/e7c6a106354baa422cb5fae30718a502.jpg\",\"introLeft\":\"/media/products/2/39baa8a07ee0c58c36be12477868818c.png\",\"movement\":\"/media/products/2/90ce515214bd0eca0215c1ab5c477c90.jpg\",\"dial\":\"/media/products/2/810451ae48710735ae3d767106791b45.jpg\",\"strapLeft\":\"/media/products/2/15fc0c63c50549625b75957a7754ab37.png\",\"strapRight\":\"/media/products/2/fcb0531272b6b9763382d025f995ec93.png\",\"introRight\":\"/media/products/2/f36aa69874505ce025e4efa7885c3fde.png\"},\"subtitle\":\"Lucent Collection\",\"collection\":\"lucent\",\"movement\":\"automatic\",\"material\":\"titanium\",\"color\":\"silver\",\"tagline\":\"Engineered for Everyday Adventure\",\"pdpSubtitle\":\"LUC-03 • Automatic Collection\",\"accent\":\"#D1D5DB\",\"editions\":[\"P-01\",\"P-02\",\"P-03\",\"P-04\",\"P-05\"],\"specs\":[{\"label\":\"Case Material\",\"value\":\"Titanium\"},{\"label\":\"Case Diameter\",\"value\":\"40mm\"},{\"label\":\"Case Thickness\",\"value\":\"11.2mm\"},{\"label\":\"Movement\",\"value\":\"Automatic Mechanical\"},{\"label\":\"Power Reserve\",\"value\":\"72 Hours\"},{\"label\":\"Water Resistance\",\"value\":\"100m / 10 ATM\"},{\"label\":\"Strap Material\",\"value\":\"Premium Textile Strap\"},{\"label\":\"Crystal\",\"value\":\"Scratch-Resistant Sapphire\"},{\"label\":\"Dial Finish\",\"value\":\"Sunburst Silver\"},{\"label\":\"Weight\",\"value\":\"78g\"},{\"label\":\"Warranty\",\"value\":\"5 Years International\"}],\"pdp\":{\"hero\":{\"subtitle\":\"FlyingTourbillonSapphire\"},\"intro\":{\"heading\":\"Frost Silver\",\"text\":\"It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using \'Content here, content here\', making it look like readable English.\",\"specs\":[{\"label\":\"Case Material\",\"value\":\"Titanium\"},{\"label\":\"Case Diameter\",\"value\":\"40mm\"},{\"label\":\"Case Thickness\",\"value\":\"11.2mm\"}]},\"parallax1\":{\"heading\":\"Frost Silver\",\"text\":\"Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco\"},\"parallax2\":{\"heading\":\"Frost Silver\",\"text\":\"Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco\"},\"movement\":{\"heading\":\"Movement\",\"text\":\"abc ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.\",\"specs\":[{\"label\":\"Movement\",\"value\":\"Automatic Mechanical\"},{\"label\":\"Power Reserve\",\"value\":\"72 Hours\"},{\"label\":\"Water Resistance\",\"value\":\"100m / 10 ATM\"}]},\"dial\":{\"heading\":\"Dial Finish\",\"text\":\"Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.\",\"specs\":[{\"label\":\"Strap Material\",\"value\":\"Premium Textile Strap\"},{\"label\":\"Crystal\",\"value\":\"Scratch-Resistant Sapphire\"},{\"label\":\"Dial Finish\",\"value\":\"Sunburst Yellow\"},{\"label\":\"Weight\",\"value\":\"78g\"},{\"label\":\"Warranty\",\"value\":\"5 Years International\"}]},\"strap\":{\"heading\":\"Frost Silver  Strap\",\"text\":\"Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco\"}}}', 'watch', 0, 0, 786.00, NULL, '/media/products/2/09506d0528962112d7597eb99eaa66bc.png', '[]', NULL, NULL, 'active', 0, '2026-10-22 23:32:46.667', '2026-10-23 19:44:59.778', NULL),
(3, NULL, NULL, 'Sunseeker Yellow', 'sunseeker-yellow-sunseekeryellow', 'LUC-01', 'lorum', 'lorum ipsum', '{\"media\":{\"hero\":\"/media/products/3/d44c535935be5de50a3bedc5e39af034.jpg\"},\"subtitle\":\"Lucent Collection\",\"collection\":\"Lucent Collection\",\"movement\":\"automatic\",\"material\":\"titanium\",\"color\":\"#c09e31\",\"accent\":\"#c09e31\",\"specs\":[{\"label\":\"Case Material\",\"value\":\"Titanium\"},{\"label\":\"Case Diameter\",\"value\":\"40mm\"},{\"label\":\"Case Thickness\",\"value\":\"11.2mm\"}],\"pdp\":{\"hero\":{\"subtitle\":\"Flying Tourbillon Sapphire\"}}}', 'watch', 0, 0, 525.00, NULL, '/media/products/3/d3f9e69823aa7df805374b95d59cfe89.png', '[]', NULL, NULL, 'active', 0, '2026-10-22 23:43:35.274', '2026-10-23 19:48:49.990', NULL),
(4, NULL, NULL, 'Nova Red', 'nova-red-luc-02', 'LUC-02', 'lorem ipsum', 'lorem ipsum dolor', '{\"media\":{\"hero\":\"/media/products/4/d30eeffed1134e539ebf21c4b15453a8.jpg\",\"parallax1\":\"/media/products/4/0cff99afe75e84bd98c99bb9733653e6.jpg\",\"parallax2\":\"/media/products/4/e59b6e6a01e2e740bef82f201571e779.jpg\",\"introLeft\":\"/media/products/4/0eafdc37952f39f141aef6420dade301.png\",\"introRight\":\"/media/products/4/1367c71bfa9a6338e911ef52d948cd39.png\",\"movement\":\"/media/products/4/72bf38124633daccfc8c0e965d0084dc.jpg\",\"dial\":\"/media/products/4/da993f20d4cf9859a0b75d1190296e54.jpg\",\"strapLeft\":\"/media/products/4/541f40f205d89518bb04593e9bd84ba2.png\",\"strapRight\":\"/media/products/4/1a8344bf4fe1eab3338a5407afc019ff.png\"},\"subtitle\":\"Lucent Collection\",\"movement\":\"automatic\",\"material\":\"titanium\",\"color\":\"red\",\"pdpSubtitle\":\"Nova Red\",\"accent\":\"#e63c5f\",\"pdp\":{\"hero\":{\"subtitle\":\"Nova Red\"},\"intro\":{\"heading\":\"Nova Red\",\"text\":\"It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using \'Content here, content here\', making it look like readable English.\",\"specs\":[{\"label\":\"Case Material\",\"value\":\"Titanium\"},{\"label\":\"Case Diameter\",\"value\":\"40mm\"}]},\"parallax1\":{\"heading\":\"Nova Red\",\"text\":\"Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco\"},\"parallax2\":{\"heading\":\"Nova Red\",\"text\":\"Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco\"},\"movement\":{\"heading\":\"Movement\",\"text\":\"abc ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.\",\"specs\":[{\"label\":\"Movement\",\"value\":\"Automatic Mechanical\"},{\"label\":\"Power Reserve\",\"value\":\"72 Hours\"},{\"label\":\"Water Resistance\",\"value\":\"100m / 10 ATM\"}]},\"dial\":{\"heading\":\"Dial Finish\",\"text\":\"Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.\",\"specs\":[{\"label\":\"Strap Material\",\"value\":\"Premium Textile Strap\"},{\"label\":\"Crystal\",\"value\":\"Scratch-Resistant Sapphire\"},{\"label\":\"Dial Finish\",\"value\":\"Sunburst Yellow\"},{\"label\":\"Weight\",\"value\":\"78g\"},{\"label\":\"Warranty\",\"value\":\"5 Years International\"}]},\"strap\":{\"heading\":\"About Strap\",\"text\":\"Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. uis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui\"}}}', 'watch', 0, 0, 158.00, NULL, '/media/products/4/ba34fb65849498706cdf82ccba143d21.png', '[\"/media/products/4/d6d3cc6498fb8bd474d8d3f4042a2203.jpg\"]', NULL, NULL, 'active', 0, '2026-10-23 00:57:13.875', '2026-10-23 01:11:02.316', NULL),
(5, NULL, NULL, 'Eclipse Black', 'eclipse-black', 'BLACK-158', 'Lorem ipsum dolor', 'adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. uis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui', '{\"media\":{\"hero\":\"/media/products/5/898d3456972f1fbaf83f3f7084b33544.jpg\"},\"subtitle\":\"Lucent Collection\",\"collection\":\"Strap\",\"movement\":\"automatic\",\"material\":\". titanium\",\"tagline\":\"Nova Red\",\"pdpSubtitle\":\"Eclipse-Black\",\"accent\":\"#da5167\",\"pdp\":{\"hero\":{\"subtitle\":\"Eclipse Black\"}}}', 'strap', 0, 0, 425.00, NULL, '/media/products/5/ce52f8048b6b60d756cfbf71107fabef.png', '[]', NULL, NULL, 'active', 0, '2026-10-23 01:41:51.817', '2026-10-23 01:49:04.243', NULL),
(6, NULL, NULL, 'Aurora Mint', 'aurora-mint', 'LUC-05', 'AuroraMint', 'FlyingTourbillonSapphire', '{\"media\":{\"hero\":\"/media/products/6/e0ed5cdd689634b9070f05dd0fb8ed10.jpg\",\"parallax1\":\"/media/products/6/4a0e29b36fa4dadeeabdf90aff887bbe.jpg\",\"parallax2\":\"/media/products/6/c2de07038c9c159afc254f39178e38cd.jpg\",\"introLeft\":\"/media/products/6/d094629812f144766ba2bdc1b20c216e.jpg\",\"movement\":\"/media/products/6/7db2f101bf8bc197c078ab248dec390f.jpg\",\"dial\":\"/media/products/6/fc281394f99775b13a392a4909d706ae.jpg\",\"strapLeft\":\"/media/products/6/188ea8b6f7bee2a9a668dc7ed0a72e8d.png\",\"strapRight\":\"/media/products/6/592235c87b462130d2c4db78e6e31412.png\",\"introRight\":\"/media/products/6/46caf9894cc7837f69b3a876f99dee48.jpg\"},\"subtitle\":\"Lucent Collection\",\"movement\":\"Automatic\",\"material\":\"Titanium\",\"pdp\":{\"hero\":{\"subtitle\":\"FlyingTourbillonSapphire\"},\"intro\":{\"heading\":\"AuroraMint\",\"text\":\"It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using \'Content here, content here\', making it look like readable English.\",\"specs\":[{\"label\":\"Feature\",\"value\":\"Specification\"},{\"label\":\"Case Material\",\"value\":\"Titanium\"},{\"label\":\"Case Diameter\",\"value\":\"40mm\"},{\"label\":\"Case Thickness\",\"value\":\"11.2mm\"}]},\"parallax1\":{\"heading\":\"AuroraMint\",\"text\":\"Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco\"},\"parallax2\":{\"heading\":\"AuroraMint\",\"text\":\"Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco\"},\"movement\":{\"heading\":\"Movement\",\"text\":\"abc ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.\",\"specs\":[{\"label\":\"Movement\",\"value\":\"Automatic Mechanical\"},{\"label\":\"Power Reserve\",\"value\":\"72 Hours\"},{\"label\":\"Water Resistance\",\"value\":\"100m / 10 ATM\"}]},\"dial\":{\"heading\":\"Dial Finish\",\"text\":\"Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.\",\"specs\":[{\"label\":\"Strap Material\",\"value\":\"Premium Textile Strap\"},{\"label\":\"Crystal\",\"value\":\"Scratch-Resistant Sapphire\"},{\"label\":\"Dial Finish\",\"value\":\"Sunburst Yellow\"},{\"label\":\"Weight\",\"value\":\"78g\"},{\"label\":\"Warranty\",\"value\":\"5 Years International\"}]},\"strap\":{\"heading\":\"About Strap Mint\",\"text\":\"Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. uis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui\"}}}', 'watch', 0, 0, 525.00, NULL, '/media/products/6/7f3aa212c03d59b3c4399f6f6b455000.png', '[]', NULL, NULL, 'active', 0, '2026-10-23 16:56:38.306', '2026-10-23 17:09:01.294', NULL),
(7, NULL, NULL, 'black starp', 'black-starp', 'BLACK1234', NULL, 'abc ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehender', '{\"media\":{\"hero\":\"/media/products/7/ac2ac8a326b6fa415b0a2152b71b8c2f.png\",\"detail\":\"/media/products/7/b284a36c770e1fd5a67aaf4753c2e6fe.png\"},\"subtitle\":\"black trap\",\"collection\":\"asdasd\",\"material\":\"titanium\",\"color\":\"black\",\"specs\":[{\"label\":\"Movement\",\"value\":\"40 mm\"},{\"label\":\"Movement\",\"value\":\"10023\"},{\"label\":\"Movement\",\"value\":\"456588\"},{\"label\":\"Movement\",\"value\":\"44778777\"}]}', 'strap', 0, 0, 424.00, NULL, '/media/products/7/20218cc53bfbea38c468b940a48e522f.png', '[]', NULL, NULL, 'active', 0, '2026-10-23 17:37:02.185', '2026-10-23 17:39:47.826', NULL),
(8, NULL, NULL, 'test', 'test', 'TEST', 'testing descripton', 'testing long description', '{\"media\":{\"hero\":\"/media/products/8/114ee02bad56f7095fe49a72c34f6659.jpg\",\"parallax1\":\"/media/products/8/f9c055be055aed112535bf531b47e855.jpg\",\"introLeft\":\"/media/products/8/a8eab0716446ab34b32eb1dd95b2a33c.jpg\",\"introRight\":\"/media/products/8/13b8f26754437273bb5b8564ca4b8f56.jpg\",\"movement\":\"/media/products/8/674ecc73616d8b2f04e2490705637e78.jpg\"},\"subtitle\":\"test sub title\",\"collection\":\"new collection\",\"movement\":\"new movement\",\"material\":\"abcd matefril\",\"color\":\"blue color\",\"tagline\":\"abcd taghline\",\"pdpSubtitle\":\"abcd sub titite\",\"accent\":\"#ffff00\",\"edition\":\"abcdfksdaal\",\"editions\":[\"notiong\"],\"pdp\":{\"hero\":{\"subtitle\":\"hero section\"},\"intro\":{\"heading\":\"intro heading\",\"text\":\"intro paragrapgh\",\"specs\":[{\"label\":\"label\",\"value\":\"value\"}]},\"parallax1\":{\"heading\":\"parallel headiing\",\"text\":\"parallel pargraph\"},\"movement\":{\"heading\":\"movement heading\",\"text\":\"momenent paragraph\"}}}', 'watch', 45, 1, 50.00, 10.00, '/media/products/8/d3659d1727dd1a18c52e796aadd859cc.jpg', '[\"/media/products/8/6b717689d3d397bd402914bb709b4888.jpg\",\"/media/products/8/fa64da8d8021a582d87a881b9b251d37.jpg\",\"/media/products/8/eb62696e38aa2a878fb40bfa1b4384a4.jpg\"]', NULL, NULL, 'active', 1, '2026-10-23 20:05:37.969', '2026-10-23 20:22:16.204', NULL),
(9, NULL, NULL, 'new strap', 'new-strap', 'NEWSKU', NULL, 'abcd description', '{\"subtitle\":\"abcd collection subtitle\",\"collection\":\"abcd collection\",\"material\":\"titanium\",\"color\":\"blue\"}', 'strap', 0, 0, 100.00, 65.00, '/media/products/9/4feb130c6cc09e9e382594849eba2a18.png', '[]', NULL, NULL, 'active', 0, '2026-10-23 20:26:38.293', '2026-10-23 20:27:19.241', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `product_reviews`
--

CREATE TABLE `product_reviews` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `product_id` bigint(20) UNSIGNED NOT NULL,
  `order_id` bigint(20) UNSIGNED NOT NULL,
  `rating` tinyint(3) UNSIGNED NOT NULL,
  `review` text DEFAULT NULL,
  `status` enum('pending','approved','rejected') NOT NULL DEFAULT 'pending',
  `created_at` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updated_at` datetime(3) NOT NULL DEFAULT current_timestamp(3)
) ;

-- --------------------------------------------------------

--
-- Table structure for table `roles`
--

CREATE TABLE `roles` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(100) NOT NULL,
  `created_at` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updated_at` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `deleted_at` datetime(3) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `roles`
--

INSERT INTO `roles` (`id`, `name`, `created_at`, `updated_at`, `deleted_at`) VALUES
(1, 'admin', '2026-10-22 19:43:47.941', '2026-10-22 19:43:47.941', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `tags`
--

CREATE TABLE `tags` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(100) NOT NULL,
  `slug` varchar(120) NOT NULL,
  `created_at` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updated_at` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `deleted_at` datetime(3) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `testimonials`
--

CREATE TABLE `testimonials` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `cms_page_id` bigint(20) UNSIGNED DEFAULT NULL,
  `name` varchar(150) NOT NULL,
  `designation` varchar(150) DEFAULT NULL,
  `company` varchar(150) DEFAULT NULL,
  `message` text NOT NULL,
  `image` varchar(255) DEFAULT NULL,
  `rating` tinyint(3) UNSIGNED DEFAULT NULL,
  `status` enum('pending','approved','rejected') NOT NULL DEFAULT 'pending',
  `sort_order` int(11) NOT NULL DEFAULT 0,
  `created_at` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updated_at` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `deleted_at` datetime(3) DEFAULT NULL
) ;

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `role_id` bigint(20) UNSIGNED NOT NULL,
  `first_name` varchar(100) NOT NULL,
  `last_name` varchar(100) DEFAULT NULL,
  `name` varchar(200) DEFAULT NULL,
  `phone` varchar(30) DEFAULT NULL,
  `email` varchar(255) NOT NULL,
  `email_verified_at` datetime(3) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `two_factor_secret` text DEFAULT NULL,
  `two_factor_enabled` tinyint(1) NOT NULL DEFAULT 0,
  `address` varchar(255) DEFAULT NULL,
  `country` varchar(100) DEFAULT NULL,
  `city` varchar(100) DEFAULT NULL,
  `state` varchar(100) DEFAULT NULL,
  `zip` varchar(20) DEFAULT NULL,
  `image` varchar(255) DEFAULT NULL,
  `status` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updated_at` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `deleted_at` datetime(3) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `role_id`, `first_name`, `last_name`, `name`, `phone`, `email`, `email_verified_at`, `password`, `two_factor_secret`, `two_factor_enabled`, `address`, `country`, `city`, `state`, `zip`, `image`, `status`, `created_at`, `updated_at`, `deleted_at`) VALUES
(1, 1, 'admin', NULL, NULL, NULL, 'admin@yopmail.com', NULL, '$argon2id$v=19$m=19456,t=2,p=1$aspiGGZw88f34c+TwKjlZQ$H8iBfYHeX2W4g4PnXIkviIEkgrtJCkDoCNqmNjV30qI', 'v1.RMgbpLyzlig6apiq.-35JVYrLrU16QAzWBYPqlA.qmP8TpvyoGPYbhQqJ5jASmPcGrU60PikD2f9VA-Eiv8', 1, NULL, NULL, NULL, NULL, NULL, NULL, 1, '2026-10-22 19:43:47.997', '2026-10-22 19:48:10.791', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `user_addresses`
--

CREATE TABLE `user_addresses` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(150) NOT NULL,
  `phone` varchar(30) NOT NULL,
  `address_line_1` varchar(255) NOT NULL,
  `address_line_2` varchar(255) DEFAULT NULL,
  `city` varchar(100) NOT NULL,
  `state` varchar(100) DEFAULT NULL,
  `country` varchar(100) NOT NULL,
  `zip` varchar(20) DEFAULT NULL,
  `is_default` tinyint(1) NOT NULL DEFAULT 0,
  `created_at` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updated_at` datetime(3) NOT NULL DEFAULT current_timestamp(3)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `wishlists`
--

CREATE TABLE `wishlists` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `product_id` bigint(20) UNSIGNED NOT NULL,
  `created_at` datetime(3) NOT NULL DEFAULT current_timestamp(3)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `_prisma_migrations`
--

CREATE TABLE `_prisma_migrations` (
  `id` varchar(36) NOT NULL,
  `checksum` varchar(64) NOT NULL,
  `finished_at` datetime(3) DEFAULT NULL,
  `migration_name` varchar(255) NOT NULL,
  `logs` text DEFAULT NULL,
  `rolled_back_at` datetime(3) DEFAULT NULL,
  `started_at` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `applied_steps_count` int(10) UNSIGNED NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `_prisma_migrations`
--

INSERT INTO `_prisma_migrations` (`id`, `checksum`, `finished_at`, `migration_name`, `logs`, `rolled_back_at`, `started_at`, `applied_steps_count`) VALUES
('84a82cf6-ab0d-4713-82b0-646420c02a39', 'fe1cc539fe876fc19a174c6451c7966bf398707d4d694b67d43584a70bde4b21', '2026-10-22 01:42:40.133', '20261022010000_watchwebsite_baseline', NULL, NULL, '2026-10-22 01:42:04.752', 1);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `blogs`
--
ALTER TABLE `blogs`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `blogs_slug_key` (`slug`),
  ADD KEY `blogs_status_published_at_idx` (`status`,`published_at`),
  ADD KEY `blogs_category_id_idx` (`category_id`),
  ADD KEY `blogs_author_id_idx` (`author_id`);

--
-- Indexes for table `blog_tag`
--
ALTER TABLE `blog_tag`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `blog_tag_blog_id_tag_id_key` (`blog_id`,`tag_id`),
  ADD KEY `blog_tag_tag_id_idx` (`tag_id`);

--
-- Indexes for table `brands`
--
ALTER TABLE `brands`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `brands_name_key` (`name`),
  ADD UNIQUE KEY `brands_slug_key` (`slug`),
  ADD KEY `brands_status_idx` (`status`);

--
-- Indexes for table `carts`
--
ALTER TABLE `carts`
  ADD PRIMARY KEY (`id`),
  ADD KEY `carts_session_id_idx` (`session_id`),
  ADD KEY `carts_user_id_status_idx` (`user_id`,`status`),
  ADD KEY `carts_status_expires_at_idx` (`status`,`expires_at`);

--
-- Indexes for table `cart_items`
--
ALTER TABLE `cart_items`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `cart_items_cart_id_product_id_options_hash_key` (`cart_id`,`product_id`,`options_hash`),
  ADD KEY `cart_items_product_id_idx` (`product_id`);

--
-- Indexes for table `categories`
--
ALTER TABLE `categories`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `categories_slug_key` (`slug`),
  ADD KEY `categories_parent_id_idx` (`parent_id`),
  ADD KEY `categories_type_status_sort_order_idx` (`type`,`status`,`sort_order`);

--
-- Indexes for table `cms_pages`
--
ALTER TABLE `cms_pages`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `cms_pages_page_slug_key` (`page_slug`);

--
-- Indexes for table `cms_page_sections`
--
ALTER TABLE `cms_page_sections`
  ADD PRIMARY KEY (`id`),
  ADD KEY `cms_page_sections_cms_page_id_section_sort_order_idx` (`cms_page_id`,`section_sort_order`);

--
-- Indexes for table `cms_page_section_fields`
--
ALTER TABLE `cms_page_section_fields`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `cms_page_section_fields_cms_page_section_id_field_group_fiel_key` (`cms_page_section_id`,`field_group`,`field_name`);

--
-- Indexes for table `contact_inquiries`
--
ALTER TABLE `contact_inquiries`
  ADD PRIMARY KEY (`id`),
  ADD KEY `contact_inquiries_is_read_created_at_idx` (`is_read`,`created_at`),
  ADD KEY `contact_inquiries_type_created_at_idx` (`type`,`created_at`),
  ADD KEY `contact_inquiries_email_idx` (`email`);

--
-- Indexes for table `coupons`
--
ALTER TABLE `coupons`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `coupons_code_key` (`code`),
  ADD KEY `coupons_status_expires_at_idx` (`status`,`expires_at`);

--
-- Indexes for table `customizer_options`
--
ALTER TABLE `customizer_options`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `customizer_options_part_option_key_key` (`part`,`option_key`),
  ADD KEY `customizer_options_part_status_sort_order_idx` (`part`,`status`,`sort_order`);

--
-- Indexes for table `general_settings`
--
ALTER TABLE `general_settings`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `general_settings_key_key` (`key`);

--
-- Indexes for table `newsletters`
--
ALTER TABLE `newsletters`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `newsletters_email_key` (`email`),
  ADD KEY `newsletters_is_subscribed_created_at_idx` (`is_subscribed`,`created_at`);

--
-- Indexes for table `orders`
--
ALTER TABLE `orders`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `orders_order_number_key` (`order_number`),
  ADD UNIQUE KEY `orders_checkout_token_key` (`checkout_token`),
  ADD KEY `orders_status_created_at_idx` (`status`,`created_at`),
  ADD KEY `orders_payment_status_created_at_idx` (`payment_status`,`created_at`),
  ADD KEY `orders_user_id_idx` (`user_id`),
  ADD KEY `orders_placed_at_idx` (`placed_at`);

--
-- Indexes for table `order_items`
--
ALTER TABLE `order_items`
  ADD PRIMARY KEY (`id`),
  ADD KEY `order_items_order_id_idx` (`order_id`),
  ADD KEY `order_items_product_id_idx` (`product_id`);

--
-- Indexes for table `payments`
--
ALTER TABLE `payments`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `payments_payment_method_transaction_id_key` (`payment_method`,`transaction_id`),
  ADD KEY `payments_order_id_idx` (`order_id`),
  ADD KEY `payments_status_created_at_idx` (`status`,`created_at`);

--
-- Indexes for table `products`
--
ALTER TABLE `products`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `products_slug_key` (`slug`),
  ADD UNIQUE KEY `products_sku_key` (`sku`),
  ADD KEY `products_status_type_idx` (`status`,`type`),
  ADD KEY `products_category_id_idx` (`category_id`),
  ADD KEY `products_brand_id_idx` (`brand_id`),
  ADD KEY `products_is_featured_status_idx` (`is_featured`,`status`);

--
-- Indexes for table `product_reviews`
--
ALTER TABLE `product_reviews`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `product_reviews_user_id_product_id_order_id_key` (`user_id`,`product_id`,`order_id`),
  ADD KEY `product_reviews_product_id_status_idx` (`product_id`,`status`),
  ADD KEY `product_reviews_order_id_fkey` (`order_id`);

--
-- Indexes for table `roles`
--
ALTER TABLE `roles`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `roles_name_key` (`name`);

--
-- Indexes for table `tags`
--
ALTER TABLE `tags`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `tags_name_key` (`name`),
  ADD UNIQUE KEY `tags_slug_key` (`slug`);

--
-- Indexes for table `testimonials`
--
ALTER TABLE `testimonials`
  ADD PRIMARY KEY (`id`),
  ADD KEY `testimonials_status_sort_order_idx` (`status`,`sort_order`),
  ADD KEY `testimonials_cms_page_id_idx` (`cms_page_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `users_email_key` (`email`),
  ADD KEY `users_role_id_idx` (`role_id`),
  ADD KEY `users_status_created_at_idx` (`status`,`created_at`);

--
-- Indexes for table `user_addresses`
--
ALTER TABLE `user_addresses`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_addresses_user_id_is_default_idx` (`user_id`,`is_default`);

--
-- Indexes for table `wishlists`
--
ALTER TABLE `wishlists`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `wishlists_user_id_product_id_key` (`user_id`,`product_id`),
  ADD KEY `wishlists_product_id_idx` (`product_id`);

--
-- Indexes for table `_prisma_migrations`
--
ALTER TABLE `_prisma_migrations`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `blogs`
--
ALTER TABLE `blogs`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `blog_tag`
--
ALTER TABLE `blog_tag`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `brands`
--
ALTER TABLE `brands`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `carts`
--
ALTER TABLE `carts`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `cart_items`
--
ALTER TABLE `cart_items`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `categories`
--
ALTER TABLE `categories`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `cms_pages`
--
ALTER TABLE `cms_pages`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `cms_page_sections`
--
ALTER TABLE `cms_page_sections`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `cms_page_section_fields`
--
ALTER TABLE `cms_page_section_fields`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `contact_inquiries`
--
ALTER TABLE `contact_inquiries`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `coupons`
--
ALTER TABLE `coupons`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `customizer_options`
--
ALTER TABLE `customizer_options`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `general_settings`
--
ALTER TABLE `general_settings`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `newsletters`
--
ALTER TABLE `newsletters`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `orders`
--
ALTER TABLE `orders`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `order_items`
--
ALTER TABLE `order_items`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `payments`
--
ALTER TABLE `payments`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `products`
--
ALTER TABLE `products`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `product_reviews`
--
ALTER TABLE `product_reviews`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `roles`
--
ALTER TABLE `roles`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `tags`
--
ALTER TABLE `tags`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `testimonials`
--
ALTER TABLE `testimonials`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `user_addresses`
--
ALTER TABLE `user_addresses`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `wishlists`
--
ALTER TABLE `wishlists`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `blogs`
--
ALTER TABLE `blogs`
  ADD CONSTRAINT `blogs_author_id_fkey` FOREIGN KEY (`author_id`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `blogs_category_id_fkey` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`);

--
-- Constraints for table `blog_tag`
--
ALTER TABLE `blog_tag`
  ADD CONSTRAINT `blog_tag_blog_id_fkey` FOREIGN KEY (`blog_id`) REFERENCES `blogs` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `blog_tag_tag_id_fkey` FOREIGN KEY (`tag_id`) REFERENCES `tags` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `carts`
--
ALTER TABLE `carts`
  ADD CONSTRAINT `carts_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `cart_items`
--
ALTER TABLE `cart_items`
  ADD CONSTRAINT `cart_items_cart_id_fkey` FOREIGN KEY (`cart_id`) REFERENCES `carts` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `cart_items_product_id_fkey` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`);

--
-- Constraints for table `categories`
--
ALTER TABLE `categories`
  ADD CONSTRAINT `categories_parent_id_fkey` FOREIGN KEY (`parent_id`) REFERENCES `categories` (`id`);

--
-- Constraints for table `cms_page_sections`
--
ALTER TABLE `cms_page_sections`
  ADD CONSTRAINT `cms_page_sections_cms_page_id_fkey` FOREIGN KEY (`cms_page_id`) REFERENCES `cms_pages` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `cms_page_section_fields`
--
ALTER TABLE `cms_page_section_fields`
  ADD CONSTRAINT `cms_page_section_fields_cms_page_section_id_fkey` FOREIGN KEY (`cms_page_section_id`) REFERENCES `cms_page_sections` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `orders`
--
ALTER TABLE `orders`
  ADD CONSTRAINT `orders_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

--
-- Constraints for table `order_items`
--
ALTER TABLE `order_items`
  ADD CONSTRAINT `order_items_order_id_fkey` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`),
  ADD CONSTRAINT `order_items_product_id_fkey` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`);

--
-- Constraints for table `payments`
--
ALTER TABLE `payments`
  ADD CONSTRAINT `payments_order_id_fkey` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`);

--
-- Constraints for table `products`
--
ALTER TABLE `products`
  ADD CONSTRAINT `products_brand_id_fkey` FOREIGN KEY (`brand_id`) REFERENCES `brands` (`id`),
  ADD CONSTRAINT `products_category_id_fkey` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`);

--
-- Constraints for table `product_reviews`
--
ALTER TABLE `product_reviews`
  ADD CONSTRAINT `product_reviews_order_id_fkey` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`),
  ADD CONSTRAINT `product_reviews_product_id_fkey` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`),
  ADD CONSTRAINT `product_reviews_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

--
-- Constraints for table `testimonials`
--
ALTER TABLE `testimonials`
  ADD CONSTRAINT `testimonials_cms_page_id_fkey` FOREIGN KEY (`cms_page_id`) REFERENCES `cms_pages` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `users`
--
ALTER TABLE `users`
  ADD CONSTRAINT `users_role_id_fkey` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`);

--
-- Constraints for table `user_addresses`
--
ALTER TABLE `user_addresses`
  ADD CONSTRAINT `user_addresses_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `wishlists`
--
ALTER TABLE `wishlists`
  ADD CONSTRAINT `wishlists_product_id_fkey` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `wishlists_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
