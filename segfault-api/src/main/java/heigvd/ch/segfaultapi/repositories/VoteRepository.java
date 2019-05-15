package heigvd.ch.segfaultapi.repositories;

import heigvd.ch.segfaultapi.model.Utilisateur;
import heigvd.ch.segfaultapi.model.Vote;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;


public interface VoteRepository extends JpaRepository<Vote, Integer> {
    List<Vote> findAllByUtilisateur(Utilisateur utilisateur);
}

