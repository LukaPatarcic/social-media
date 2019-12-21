<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20191217144251 extends AbstractMigration
{
    public function getDescription() : string
    {
        return '';
    }

    public function up(Schema $schema) : void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->abortIf($this->connection->getDatabasePlatform()->getName() !== 'mysql', 'Migration can only be executed safely on \'mysql\'.');

        $this->addSql('CREATE TABLE user (id INT AUTO_INCREMENT NOT NULL, email VARCHAR(180) NOT NULL, roles JSON NOT NULL, password VARCHAR(255) NOT NULL, first_name VARCHAR(255) DEFAULT NULL, last_name VARCHAR(255) DEFAULT NULL, profile_name VARCHAR(255) DEFAULT NULL, token VARCHAR(255) DEFAULT NULL, expires_at DATETIME DEFAULT NULL, is_verified TINYINT(1) NOT NULL, verification_code VARCHAR(255) DEFAULT NULL, deletes_in DATETIME DEFAULT NULL, UNIQUE INDEX UNIQ_8D93D649E7927C74 (email), UNIQUE INDEX UNIQ_8D93D6495F37A13B (token), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE friend (id INT AUTO_INCREMENT NOT NULL, user_one_id INT NOT NULL, user_two_id INT NOT NULL, INDEX IDX_55EEAC619EC8D52E (user_one_id), INDEX IDX_55EEAC61F59432E1 (user_two_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE friend_request (id INT AUTO_INCREMENT NOT NULL, user_from_id INT NOT NULL, user_to_id INT NOT NULL, accepted TINYINT(1) DEFAULT NULL, INDEX IDX_F284D9420C3C701 (user_from_id), INDEX IDX_F284D94D2F7B13D (user_to_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('ALTER TABLE friend ADD CONSTRAINT FK_55EEAC619EC8D52E FOREIGN KEY (user_one_id) REFERENCES user (id)');
        $this->addSql('ALTER TABLE friend ADD CONSTRAINT FK_55EEAC61F59432E1 FOREIGN KEY (user_two_id) REFERENCES user (id)');
        $this->addSql('ALTER TABLE friend_request ADD CONSTRAINT FK_F284D9420C3C701 FOREIGN KEY (user_from_id) REFERENCES user (id)');
        $this->addSql('ALTER TABLE friend_request ADD CONSTRAINT FK_F284D94D2F7B13D FOREIGN KEY (user_to_id) REFERENCES user (id)');
    }

    public function down(Schema $schema) : void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->abortIf($this->connection->getDatabasePlatform()->getName() !== 'mysql', 'Migration can only be executed safely on \'mysql\'.');

        $this->addSql('ALTER TABLE friend DROP FOREIGN KEY FK_55EEAC619EC8D52E');
        $this->addSql('ALTER TABLE friend DROP FOREIGN KEY FK_55EEAC61F59432E1');
        $this->addSql('ALTER TABLE friend_request DROP FOREIGN KEY FK_F284D9420C3C701');
        $this->addSql('ALTER TABLE friend_request DROP FOREIGN KEY FK_F284D94D2F7B13D');
        $this->addSql('DROP TABLE user');
        $this->addSql('DROP TABLE friend');
        $this->addSql('DROP TABLE friend_request');
    }
}
