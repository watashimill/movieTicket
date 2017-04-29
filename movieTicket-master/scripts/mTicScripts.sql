-- MySQL Script generated by MySQL Workbench
-- 04/28/17 22:22:52
-- Model: New Model    Version: 1.0
-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='TRADITIONAL,ALLOW_INVALID_DATES';

-- -----------------------------------------------------
-- Schema movieticket
-- -----------------------------------------------------

-- -----------------------------------------------------
-- Schema movieticket
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `movieticket` DEFAULT CHARACTER SET utf8 ;
USE `movieticket` ;

-- -----------------------------------------------------
-- Table `movieticket`.`Customer`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `movieticket`.`Customer` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT, 
  `c_username` VARCHAR(20) NOT NULL, 
  `password` CHAR(60) NOT NULL, 
  `phone_no` INT NULL,
  `c_fname` VARCHAR(45) NULL,
  `c_lname` VARCHAR(45) NULL,
  `c_email` VARCHAR(45) NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `c_username_UNIQUE` (`c_username` ASC))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `movieticket`.`Theatre`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `movieticket`.`Theatre` (
  `theatre_id` VARCHAR(45) NOT NULL,
  `theatre_name` VARCHAR(45) NOT NULL,
  `location` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`theatre_id`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `movieticket`.`Movie`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `movieticket`.`Movie` (
  `m_id` INT NOT NULL,
  `m_name` VARCHAR(45) NOT NULL,
  `actors` VARCHAR(45) NOT NULL,
  `director` VARCHAR(45) NOT NULL,
  `release_date` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`m_id`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `movieticket`.`Show`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `movieticket`.`Show` (
  `show_id` VARCHAR(45) NOT NULL,
  `st_time` TIME(6) NOT NULL,
  `end_time` TIME(6) NOT NULL,
  `language` VARCHAR(45) NOT NULL,
  `Movie_m_id` INT NOT NULL,
  PRIMARY KEY (`show_id`),
  INDEX `fk_Show_Movie1_idx` (`Movie_m_id` ASC),
  CONSTRAINT `fk_Show_Movie1`
    FOREIGN KEY (`Movie_m_id`)
    REFERENCES `movieticket`.`Movie` (`m_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `movieticket`.`Tickets`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `movieticket`.`Tickets` (
  `ticket_no` INT NOT NULL,
  `hall_no` VARCHAR(45) NOT NULL,
  `theatre_id` VARCHAR(45) NOT NULL,
  `price` INT NOT NULL,
  `seat_no` VARCHAR(45) NOT NULL,
  `show_date` DATE NOT NULL,
  `show_id` VARCHAR(45) NOT NULL,
  `admin_id` VARCHAR(45) NOT NULL,
  `Customer_id` INT UNSIGNED NOT NULL,
  `Theatre_theatre_id` VARCHAR(45) NOT NULL,
  `Show_show_id` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`ticket_no`),
  INDEX `fk_Tickets_Customer_idx` (`Customer_id` ASC),
  INDEX `fk_Tickets_Theatre1_idx` (`Theatre_theatre_id` ASC),
  INDEX `fk_Tickets_Show1_idx` (`Show_show_id` ASC),
  CONSTRAINT `fk_Tickets_Customer`
    FOREIGN KEY (`Customer_id`)
    REFERENCES `movieticket`.`Customer` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_Tickets_Theatre1`
    FOREIGN KEY (`Theatre_theatre_id`)
    REFERENCES `movieticket`.`Theatre` (`theatre_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_Tickets_Show1`
    FOREIGN KEY (`Show_show_id`)
    REFERENCES `movieticket`.`Show` (`show_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `movieticket`.`Seats`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `movieticket`.`Seats` (
  `seat_id` VARCHAR(45) NOT NULL,
  `seat_name` VARCHAR(45) NULL,
  `seat_num` VARCHAR(45) NULL,
  `Theatre_t_id` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`seat_id`, `Theatre_t_id`),
  INDEX `fk_Seats_Theatre1_idx` (`Theatre_t_id` ASC),
  CONSTRAINT `fk_Seats_Theatre1`
    FOREIGN KEY (`Theatre_t_id`)
    REFERENCES `movieticket`.`Theatre` (`theatre_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `movieticket`.`Admin`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `movieticket`.`Admin` (
  `admin_id` VARCHAR(45) NOT NULL,
  `password` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`admin_id`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `movieticket`.`Admin_has_Theatre`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `movieticket`.`Admin_has_Theatre` (
  `Admin_admin_id` VARCHAR(45) NOT NULL,
  `Theatre_t_id` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`Admin_admin_id`, `Theatre_t_id`),
  INDEX `fk_Admin_has_Theatre_Theatre1_idx` (`Theatre_t_id` ASC),
  INDEX `fk_Admin_has_Theatre_Admin1_idx` (`Admin_admin_id` ASC),
  CONSTRAINT `fk_Admin_has_Theatre_Admin1`
    FOREIGN KEY (`Admin_admin_id`)
    REFERENCES `movieticket`.`Admin` (`admin_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_Admin_has_Theatre_Theatre1`
    FOREIGN KEY (`Theatre_t_id`)
    REFERENCES `movieticket`.`Theatre` (`theatre_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
