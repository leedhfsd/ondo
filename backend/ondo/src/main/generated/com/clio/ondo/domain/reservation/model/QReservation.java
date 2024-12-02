package com.clio.ondo.domain.reservation.model;

import static com.querydsl.core.types.PathMetadataFactory.*;

import com.querydsl.core.types.dsl.*;

import com.querydsl.core.types.PathMetadata;
import javax.annotation.processing.Generated;
import com.querydsl.core.types.Path;
import com.querydsl.core.types.dsl.PathInits;


/**
 * QReservation is a Querydsl query type for Reservation
 */
@Generated("com.querydsl.codegen.DefaultEntitySerializer")
public class QReservation extends EntityPathBase<Reservation> {

    private static final long serialVersionUID = -1712898035L;

    private static final PathInits INITS = PathInits.DIRECT2;

    public static final QReservation reservation = new QReservation("reservation");

    public final com.clio.ondo.domain.counselDetail.model.QCounselDetail counselDetail;

    public final StringPath counselingUrl = createString("counselingUrl");

    public final com.clio.ondo.domain.counselor.model.QCounselor counselor;

    public final StringPath detail = createString("detail");

    public final NumberPath<Long> id = createNumber("id", Long.class);

    public final com.clio.ondo.domain.member.model.QMember member;

    public final DateTimePath<java.time.LocalDateTime> reservationDate = createDateTime("reservationDate", java.time.LocalDateTime.class);

    public QReservation(String variable) {
        this(Reservation.class, forVariable(variable), INITS);
    }

    public QReservation(Path<? extends Reservation> path) {
        this(path.getType(), path.getMetadata(), PathInits.getFor(path.getMetadata(), INITS));
    }

    public QReservation(PathMetadata metadata) {
        this(metadata, PathInits.getFor(metadata, INITS));
    }

    public QReservation(PathMetadata metadata, PathInits inits) {
        this(Reservation.class, metadata, inits);
    }

    public QReservation(Class<? extends Reservation> type, PathMetadata metadata, PathInits inits) {
        super(type, metadata, inits);
        this.counselDetail = inits.isInitialized("counselDetail") ? new com.clio.ondo.domain.counselDetail.model.QCounselDetail(forProperty("counselDetail"), inits.get("counselDetail")) : null;
        this.counselor = inits.isInitialized("counselor") ? new com.clio.ondo.domain.counselor.model.QCounselor(forProperty("counselor"), inits.get("counselor")) : null;
        this.member = inits.isInitialized("member") ? new com.clio.ondo.domain.member.model.QMember(forProperty("member"), inits.get("member")) : null;
    }

}

