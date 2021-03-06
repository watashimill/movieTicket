-- MySQL Script generated by MySQL Workbench
-- 05/16/17 06:03:18
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
  `c_username` VARCHAR(45) NULL,
  `password` VARCHAR(60) NOT NULL,
  `c_fname` VARCHAR(45) NOT NULL,
  `c_lname` VARCHAR(45) NOT NULL,
  `c_email` VARCHAR(45) NOT NULL,
  `role` VARCHAR(45) NOT NULL,
  `card_id` TEXT NULL,
  UNIQUE INDEX `c_username_UNIQUE` (`c_username` ASC),
  PRIMARY KEY (`id`))
ENGINE = InnoDB
PACK_KEYS = DEFAULT;


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
-- Table `movieticket`.`Theatre`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `movieticket`.`Theatre` (
  `theatre_id` VARCHAR(45) NOT NULL,
  `location` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`theatre_id`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `movieticket`.`Hall`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `movieticket`.`Hall` (
  `hall_id` INT NOT NULL,
  `hall_name` VARCHAR(45) NOT NULL,
  `Theatre_theatre_id` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`Theatre_theatre_id`, `hall_id`),
  CONSTRAINT `fk_Hall_Theatre1`
    FOREIGN KEY (`Theatre_theatre_id`)
    REFERENCES `movieticket`.`Theatre` (`theatre_id`)
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
  `Hall_Theatre_theatre_id` VARCHAR(45) NOT NULL,
  `Hall_hall_id` INT NOT NULL,
  PRIMARY KEY (`Hall_Theatre_theatre_id`, `Hall_hall_id`, `seat_id`),
  CONSTRAINT `fk_Seats_Hall1`
    FOREIGN KEY (`Hall_Theatre_theatre_id` , `Hall_hall_id`)
    REFERENCES `movieticket`.`Hall` (`Theatre_theatre_id` , `hall_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `movieticket`.`Tickets`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `movieticket`.`Tickets` (
  `ticket_no` INT NOT NULL,
  `price` INT NOT NULL,
  `show_date` DATE NOT NULL,
  `show_id` VARCHAR(45) NOT NULL,
  `admin_id` VARCHAR(45) NOT NULL,
  `Customer_id` INT UNSIGNED NOT NULL,
  `Show_show_id` VARCHAR(45) NOT NULL,
  `Seats_Hall_Theatre_theatre_id` VARCHAR(45) NOT NULL,
  `Seats_Hall_hall_id` INT NOT NULL,
  `Seats_seat_id` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`ticket_no`),
  INDEX `fk_Tickets_Customer_idx` (`Customer_id` ASC),
  INDEX `fk_Tickets_Show1_idx` (`Show_show_id` ASC),
  INDEX `fk_Tickets_Seats1_idx` (`Seats_Hall_Theatre_theatre_id` ASC, `Seats_Hall_hall_id` ASC, `Seats_seat_id` ASC),
  CONSTRAINT `fk_Tickets_Customer`
    FOREIGN KEY (`Customer_id`)
    REFERENCES `movieticket`.`Customer` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_Tickets_Show1`
    FOREIGN KEY (`Show_show_id`)
    REFERENCES `movieticket`.`Show` (`show_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_Tickets_Seats1`
    FOREIGN KEY (`Seats_Hall_Theatre_theatre_id` , `Seats_Hall_hall_id` , `Seats_seat_id`)
    REFERENCES `movieticket`.`Seats` (`Hall_Theatre_theatre_id` , `Hall_hall_id` , `seat_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `movieticket`.`log`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `movieticket`.`log` (
  `timestamp` INT NOT NULL,
  `Tickets_ticket_no` INT NOT NULL,
  PRIMARY KEY (`Tickets_ticket_no`),
  CONSTRAINT `fk_log_Tickets1`
    FOREIGN KEY (`Tickets_ticket_no`)
    REFERENCES `movieticket`.`Tickets` (`ticket_no`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
