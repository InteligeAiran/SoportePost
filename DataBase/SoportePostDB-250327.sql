PGDMP                         }            SoportePost    15.3    15.3 �    
           0    0    ENCODING    ENCODING        SET client_encoding = 'UTF8';
                      false                       0    0 
   STDSTRINGS 
   STDSTRINGS     (   SET standard_conforming_strings = 'on';
                      false                       0    0 
   SEARCHPATH 
   SEARCHPATH     8   SELECT pg_catalog.set_config('search_path', '', false);
                      false                       1262    19193    SoportePost    DATABASE     �   CREATE DATABASE "SoportePost" WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'Spanish_Venezuela.1252';
    DROP DATABASE "SoportePost";
                postgres    false                        3079    19609    dblink 	   EXTENSION     :   CREATE EXTENSION IF NOT EXISTS dblink WITH SCHEMA public;
    DROP EXTENSION dblink;
                   false                       0    0    EXTENSION dblink    COMMENT     _   COMMENT ON EXTENSION dblink IS 'connect to other PostgreSQL databases from within a database';
                        false    2            �            1259    19775    accions_tickets    TABLE     }   CREATE TABLE public.accions_tickets (
    id_accion_ticket integer NOT NULL,
    name_accion_ticket character varying(50)
);
 #   DROP TABLE public.accions_tickets;
       public         heap    postgres    false            �            1259    19316    areas    TABLE     b   CREATE TABLE public.areas (
    id_area integer NOT NULL,
    name_area character varying(100)
);
    DROP TABLE public.areas;
       public         heap    postgres    false            �            1259    19351    assignments_tickets    TABLE     �   CREATE TABLE public.assignments_tickets (
    id_assginment_ticket integer NOT NULL,
    id_ticket integer,
    id_coordinator integer,
    id_tecnico integer,
    date_sendcoordinator date,
    note character varying(200),
    date_assign_tec2 date
);
 '   DROP TABLE public.assignments_tickets;
       public         heap    postgres    false            �            1259    19315    departments_id_department_seq    SEQUENCE     �   CREATE SEQUENCE public.departments_id_department_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 4   DROP SEQUENCE public.departments_id_department_seq;
       public          postgres    false    226                       0    0    departments_id_department_seq    SEQUENCE OWNED BY     S   ALTER SEQUENCE public.departments_id_department_seq OWNED BY public.areas.id_area;
          public          postgres    false    225            �            1259    19460    failures    TABLE     �   CREATE TABLE public.failures (
    id_failure integer NOT NULL,
    name_failure character varying(100),
    id_failure_level integer
);
    DROP TABLE public.failures;
       public         heap    postgres    false            �            1259    19459    failures_id_failure_seq    SEQUENCE     �   CREATE SEQUENCE public.failures_id_failure_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 .   DROP SEQUENCE public.failures_id_failure_seq;
       public          postgres    false    232                       0    0    failures_id_failure_seq    SEQUENCE OWNED BY     S   ALTER SEQUENCE public.failures_id_failure_seq OWNED BY public.failures.id_failure;
          public          postgres    false    231            �            1259    19548    levels_tecnicos    TABLE     �   CREATE TABLE public.levels_tecnicos (
    id_level_tecnico integer NOT NULL,
    name_level character varying(100),
    description character varying(200)
);
 #   DROP TABLE public.levels_tecnicos;
       public         heap    postgres    false            �            1259    19547 $   levels_tecnicos_id_level_tecnico_seq    SEQUENCE     �   CREATE SEQUENCE public.levels_tecnicos_id_level_tecnico_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 ;   DROP SEQUENCE public.levels_tecnicos_id_level_tecnico_seq;
       public          postgres    false    243                       0    0 $   levels_tecnicos_id_level_tecnico_seq    SEQUENCE OWNED BY     m   ALTER SEQUENCE public.levels_tecnicos_id_level_tecnico_seq OWNED BY public.levels_tecnicos.id_level_tecnico;
          public          postgres    false    242            �            1259    19770    process_tickets    TABLE        CREATE TABLE public.process_tickets (
    id_process_ticket integer NOT NULL,
    name_process_ticket character varying(50)
);
 #   DROP TABLE public.process_tickets;
       public         heap    postgres    false            �            1259    19274    regions    TABLE     �   CREATE TABLE public.regions (
    id_region integer NOT NULL,
    name_region character varying(100),
    "id_statusReg" integer
);
    DROP TABLE public.regions;
       public         heap    postgres    false            �            1259    19273    regions_id_region_seq    SEQUENCE     �   CREATE SEQUENCE public.regions_id_region_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 ,   DROP SEQUENCE public.regions_id_region_seq;
       public          postgres    false    222                       0    0    regions_id_region_seq    SEQUENCE OWNED BY     O   ALTER SEQUENCE public.regions_id_region_seq OWNED BY public.regions.id_region;
          public          postgres    false    221            �            1259    19288    regionstecnicos    TABLE     }   CREATE TABLE public.regionstecnicos (
    id_regionstecnicos integer NOT NULL,
    id_region integer,
    id_user integer
);
 #   DROP TABLE public.regionstecnicos;
       public         heap    postgres    false            �            1259    19287 &   regionstecnicos_id_regionstecnicos_seq    SEQUENCE     �   CREATE SEQUENCE public.regionstecnicos_id_regionstecnicos_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 =   DROP SEQUENCE public.regionstecnicos_id_regionstecnicos_seq;
       public          postgres    false    224                       0    0 &   regionstecnicos_id_regionstecnicos_seq    SEQUENCE OWNED BY     q   ALTER SEQUENCE public.regionstecnicos_id_regionstecnicos_seq OWNED BY public.regionstecnicos.id_regionstecnicos;
          public          postgres    false    223            �            1259    19255    roles    TABLE     b   CREATE TABLE public.roles (
    id_rolusr integer NOT NULL,
    name_rol character varying(50)
);
    DROP TABLE public.roles;
       public         heap    postgres    false            �            1259    19254    roles_id_rolusr_seq    SEQUENCE     �   CREATE SEQUENCE public.roles_id_rolusr_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 *   DROP SEQUENCE public.roles_id_rolusr_seq;
       public          postgres    false    218                       0    0    roles_id_rolusr_seq    SEQUENCE OWNED BY     K   ALTER SEQUENCE public.roles_id_rolusr_seq OWNED BY public.roles.id_rolusr;
          public          postgres    false    217            �            1259    19751    sessions_users    TABLE     t  CREATE TABLE public.sessions_users (
    id_session character varying(255) NOT NULL,
    id_user integer,
    start_date timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    user_agent character varying(255),
    ip_address character varying(45),
    active integer DEFAULT 0,
    end_date timestamp without time zone,
    expiry_time timestamp without time zone
);
 "   DROP TABLE public.sessions_users;
       public         heap    postgres    false            �            1259    19267    states    TABLE     |   CREATE TABLE public.states (
    id_state integer NOT NULL,
    name_state character varying(100),
    id_region integer
);
    DROP TABLE public.states;
       public         heap    postgres    false            �            1259    19266    states_id_state_seq    SEQUENCE     �   CREATE SEQUENCE public.states_id_state_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 *   DROP SEQUENCE public.states_id_state_seq;
       public          postgres    false    220                       0    0    states_id_state_seq    SEQUENCE OWNED BY     K   ALTER SEQUENCE public.states_id_state_seq OWNED BY public.states.id_state;
          public          postgres    false    219            �            1259    19490 
   status_lab    TABLE     r   CREATE TABLE public.status_lab (
    id_status_lab integer NOT NULL,
    name_status_lab character varying(50)
);
    DROP TABLE public.status_lab;
       public         heap    postgres    false            �            1259    19489    status_lab_id_status_lab_seq    SEQUENCE     �   CREATE SEQUENCE public.status_lab_id_status_lab_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 3   DROP SEQUENCE public.status_lab_id_status_lab_seq;
       public          postgres    false    235                       0    0    status_lab_id_status_lab_seq    SEQUENCE OWNED BY     ]   ALTER SEQUENCE public.status_lab_id_status_lab_seq OWNED BY public.status_lab.id_status_lab;
          public          postgres    false    234            �            1259    20059    status_payments    TABLE        CREATE TABLE public.status_payments (
    id_status_payment integer NOT NULL,
    name_status_payment character varying(50)
);
 #   DROP TABLE public.status_payments;
       public         heap    postgres    false            �            1259    20058 %   status_payments_id_status_payment_seq    SEQUENCE     �   CREATE SEQUENCE public.status_payments_id_status_payment_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 <   DROP SEQUENCE public.status_payments_id_status_payment_seq;
       public          postgres    false    253                       0    0 %   status_payments_id_status_payment_seq    SEQUENCE OWNED BY     o   ALTER SEQUENCE public.status_payments_id_status_payment_seq OWNED BY public.status_payments.id_status_payment;
          public          postgres    false    252            �            1259    19516    status_tickets    TABLE     |   CREATE TABLE public.status_tickets (
    id_status_ticket integer NOT NULL,
    name_status_ticket character varying(50)
);
 "   DROP TABLE public.status_tickets;
       public         heap    postgres    false            �            1259    19515 #   status_tickets_id_status_ticket_seq    SEQUENCE     �   CREATE SEQUENCE public.status_tickets_id_status_ticket_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 :   DROP SEQUENCE public.status_tickets_id_status_ticket_seq;
       public          postgres    false    239                       0    0 #   status_tickets_id_status_ticket_seq    SEQUENCE OWNED BY     k   ALTER SEQUENCE public.status_tickets_id_status_ticket_seq OWNED BY public.status_tickets.id_status_ticket;
          public          postgres    false    238            �            1259    19860 	   ticket_n1    TABLE     P  CREATE TABLE public.ticket_n1 (
    id_ticket integer NOT NULL,
    date_create timestamp without time zone,
    id_user integer,
    serial_pos character varying(200),
    id_status_ticket integer,
    id_process_ticket integer,
    id_accion_ticket integer,
    descrip_failure character varying(500),
    id_level_failure integer
);
    DROP TABLE public.ticket_n1;
       public         heap    postgres    false            �            1259    19859    ticket_n1_id_ticket_seq    SEQUENCE     �   CREATE SEQUENCE public.ticket_n1_id_ticket_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 .   DROP SEQUENCE public.ticket_n1_id_ticket_seq;
       public          postgres    false    251                       0    0    ticket_n1_id_ticket_seq    SEQUENCE OWNED BY     S   ALTER SEQUENCE public.ticket_n1_id_ticket_seq OWNED BY public.ticket_n1.id_ticket;
          public          postgres    false    250            �            1259    19472    tickets_failures    TABLE     �   CREATE TABLE public.tickets_failures (
    id_ticket_failure integer NOT NULL,
    id_ticket integer,
    id_failure integer
);
 $   DROP TABLE public.tickets_failures;
       public         heap    postgres    false            �            1259    19368    tickets_n2.    TABLE     �  CREATE TABLE public."tickets_n2." (
    id_ticket integer NOT NULL,
    id_status_ticket integer,
    date_create_ticket date,
    serial_pos character varying(100),
    downl_exoneration bytea,
    downl_payment bytea,
    downl_send_to_rosal bytea,
    date_send_lab date,
    date_send_torosal_fromlab date,
    id_status_domiciliacion integer,
    date_sendkey date,
    date_receivekey date,
    downl_send_fromrosal date,
    date_receivefrom_desti date,
    motive_close date,
    fails_customer text,
    id_process_ticket integer,
    id_accion_ticket integer,
    id_status_payment integer,
    id_user_coord integer,
    id_failure integer,
    id_level_failure integer
);
 !   DROP TABLE public."tickets_n2.";
       public         heap    postgres    false                       0    0 (   COLUMN "tickets_n2.".downl_send_to_rosal    COMMENT     k   COMMENT ON COLUMN public."tickets_n2.".downl_send_to_rosal IS 'Cuando se envia al rosal de estado origen';
          public          postgres    false    228                       0    0 .   COLUMN "tickets_n2.".date_send_torosal_fromlab    COMMENT     p   COMMENT ON COLUMN public."tickets_n2.".date_send_torosal_fromlab IS 'Cuando se envia del laboratorio al rosal';
          public          postgres    false    228                       0    0 )   COLUMN "tickets_n2.".downl_send_fromrosal    COMMENT     r   COMMENT ON COLUMN public."tickets_n2.".downl_send_fromrosal IS 'Este es la guia de ZOOM enviada al estdo origen';
          public          postgres    false    228                       0    0 +   COLUMN "tickets_n2.".date_receivefrom_desti    COMMENT     ^   COMMENT ON COLUMN public."tickets_n2.".date_receivefrom_desti IS 'Recibido es estado origen';
          public          postgres    false    228            �            1259    19668    tickets_status_history    TABLE     _  CREATE TABLE public.tickets_status_history (
    id_history integer NOT NULL,
    id_ticket integer,
    old_status integer,
    new_status integer,
    changed_by integer,
    changed_at timestamp without time zone,
    notes character varying(255),
    old_process integer,
    new_process integer,
    old_action integer,
    new_action integer
);
 *   DROP TABLE public.tickets_status_history;
       public         heap    postgres    false            �            1259    19667 %   tickets_status_history_id_history_seq    SEQUENCE     �   CREATE SEQUENCE public.tickets_status_history_id_history_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 <   DROP SEQUENCE public.tickets_status_history_id_history_seq;
       public          postgres    false    246                       0    0 %   tickets_status_history_id_history_seq    SEQUENCE OWNED BY     o   ALTER SEQUENCE public.tickets_status_history_id_history_seq OWNED BY public.tickets_status_history.id_history;
          public          postgres    false    245            �            1259    19497    tickets_status_lab    TABLE     �   CREATE TABLE public.tickets_status_lab (
    id_ticket_status_lab integer NOT NULL,
    id_ticket integer,
    id_status_lab integer
);
 &   DROP TABLE public.tickets_status_lab;
       public         heap    postgres    false            �            1259    19496 +   tickets_status_lab_id_ticket_status_lab_seq    SEQUENCE     �   CREATE SEQUENCE public.tickets_status_lab_id_ticket_status_lab_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 B   DROP SEQUENCE public.tickets_status_lab_id_ticket_status_lab_seq;
       public          postgres    false    237                       0    0 +   tickets_status_lab_id_ticket_status_lab_seq    SEQUENCE OWNED BY     {   ALTER SEQUENCE public.tickets_status_lab_id_ticket_status_lab_seq OWNED BY public.tickets_status_lab.id_ticket_status_lab;
          public          postgres    false    236            �            1259    19524    tickets_status_tickets    TABLE     �   CREATE TABLE public.tickets_status_tickets (
    id_ticket_status_ticket integer NOT NULL,
    id_ticket integer,
    id_status_ticket integer,
    "date _status_ticket" date
);
 *   DROP TABLE public.tickets_status_tickets;
       public         heap    postgres    false            �            1259    19523 2   tickets_status_tickets_id_ticket_status_ticket_seq    SEQUENCE     �   CREATE SEQUENCE public.tickets_status_tickets_id_ticket_status_ticket_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 I   DROP SEQUENCE public.tickets_status_tickets_id_ticket_status_ticket_seq;
       public          postgres    false    241                        0    0 2   tickets_status_tickets_id_ticket_status_ticket_seq    SEQUENCE OWNED BY     �   ALTER SEQUENCE public.tickets_status_tickets_id_ticket_status_ticket_seq OWNED BY public.tickets_status_tickets.id_ticket_status_ticket;
          public          postgres    false    240            �            1259    19202    users    TABLE     �  CREATE TABLE public.users (
    id_user integer NOT NULL,
    national_id character varying(10),
    id_statususr integer,
    name character varying(50),
    surname character varying(50),
    username character varying(50),
    password character varying(200),
    id_rolusr integer,
    email character varying(100),
    id_area integer,
    trying_failedpassw integer,
    date_create time with time zone,
    id_level_tecnico integer
);
    DROP TABLE public.users;
       public         heap    postgres    false            �            1259    19201    users_id_user_seq    SEQUENCE     �   CREATE SEQUENCE public.users_id_user_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 (   DROP SEQUENCE public.users_id_user_seq;
       public          postgres    false    216            !           0    0    users_id_user_seq    SEQUENCE OWNED BY     G   ALTER SEQUENCE public.users_id_user_seq OWNED BY public.users.id_user;
          public          postgres    false    215            �            1259    19414    users_tickets    TABLE     w   CREATE TABLE public.users_tickets (
    id_user_ticket integer NOT NULL,
    id_user integer,
    id_ticket integer
);
 !   DROP TABLE public.users_tickets;
       public         heap    postgres    false            �            1259    19413     users_tickets_id_user_ticket_seq    SEQUENCE     �   CREATE SEQUENCE public.users_tickets_id_user_ticket_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 7   DROP SEQUENCE public.users_tickets_id_user_ticket_seq;
       public          postgres    false    230            "           0    0     users_tickets_id_user_ticket_seq    SEQUENCE OWNED BY     e   ALTER SEQUENCE public.users_tickets_id_user_ticket_seq OWNED BY public.users_tickets.id_user_ticket;
          public          postgres    false    229            �           2604    19319    areas id_area    DEFAULT     z   ALTER TABLE ONLY public.areas ALTER COLUMN id_area SET DEFAULT nextval('public.departments_id_department_seq'::regclass);
 <   ALTER TABLE public.areas ALTER COLUMN id_area DROP DEFAULT;
       public          postgres    false    225    226    226            �           2604    19463    failures id_failure    DEFAULT     z   ALTER TABLE ONLY public.failures ALTER COLUMN id_failure SET DEFAULT nextval('public.failures_id_failure_seq'::regclass);
 B   ALTER TABLE public.failures ALTER COLUMN id_failure DROP DEFAULT;
       public          postgres    false    232    231    232                       2604    19551     levels_tecnicos id_level_tecnico    DEFAULT     �   ALTER TABLE ONLY public.levels_tecnicos ALTER COLUMN id_level_tecnico SET DEFAULT nextval('public.levels_tecnicos_id_level_tecnico_seq'::regclass);
 O   ALTER TABLE public.levels_tecnicos ALTER COLUMN id_level_tecnico DROP DEFAULT;
       public          postgres    false    242    243    243            �           2604    19277    regions id_region    DEFAULT     v   ALTER TABLE ONLY public.regions ALTER COLUMN id_region SET DEFAULT nextval('public.regions_id_region_seq'::regclass);
 @   ALTER TABLE public.regions ALTER COLUMN id_region DROP DEFAULT;
       public          postgres    false    222    221    222            �           2604    19291 "   regionstecnicos id_regionstecnicos    DEFAULT     �   ALTER TABLE ONLY public.regionstecnicos ALTER COLUMN id_regionstecnicos SET DEFAULT nextval('public.regionstecnicos_id_regionstecnicos_seq'::regclass);
 Q   ALTER TABLE public.regionstecnicos ALTER COLUMN id_regionstecnicos DROP DEFAULT;
       public          postgres    false    224    223    224            �           2604    19258    roles id_rolusr    DEFAULT     r   ALTER TABLE ONLY public.roles ALTER COLUMN id_rolusr SET DEFAULT nextval('public.roles_id_rolusr_seq'::regclass);
 >   ALTER TABLE public.roles ALTER COLUMN id_rolusr DROP DEFAULT;
       public          postgres    false    218    217    218            �           2604    19270    states id_state    DEFAULT     r   ALTER TABLE ONLY public.states ALTER COLUMN id_state SET DEFAULT nextval('public.states_id_state_seq'::regclass);
 >   ALTER TABLE public.states ALTER COLUMN id_state DROP DEFAULT;
       public          postgres    false    220    219    220            �           2604    19493    status_lab id_status_lab    DEFAULT     �   ALTER TABLE ONLY public.status_lab ALTER COLUMN id_status_lab SET DEFAULT nextval('public.status_lab_id_status_lab_seq'::regclass);
 G   ALTER TABLE public.status_lab ALTER COLUMN id_status_lab DROP DEFAULT;
       public          postgres    false    234    235    235                       2604    20062 !   status_payments id_status_payment    DEFAULT     �   ALTER TABLE ONLY public.status_payments ALTER COLUMN id_status_payment SET DEFAULT nextval('public.status_payments_id_status_payment_seq'::regclass);
 P   ALTER TABLE public.status_payments ALTER COLUMN id_status_payment DROP DEFAULT;
       public          postgres    false    253    252    253                       2604    19519    status_tickets id_status_ticket    DEFAULT     �   ALTER TABLE ONLY public.status_tickets ALTER COLUMN id_status_ticket SET DEFAULT nextval('public.status_tickets_id_status_ticket_seq'::regclass);
 N   ALTER TABLE public.status_tickets ALTER COLUMN id_status_ticket DROP DEFAULT;
       public          postgres    false    238    239    239                       2604    19863    ticket_n1 id_ticket    DEFAULT     z   ALTER TABLE ONLY public.ticket_n1 ALTER COLUMN id_ticket SET DEFAULT nextval('public.ticket_n1_id_ticket_seq'::regclass);
 B   ALTER TABLE public.ticket_n1 ALTER COLUMN id_ticket DROP DEFAULT;
       public          postgres    false    250    251    251                       2604    19671 !   tickets_status_history id_history    DEFAULT     �   ALTER TABLE ONLY public.tickets_status_history ALTER COLUMN id_history SET DEFAULT nextval('public.tickets_status_history_id_history_seq'::regclass);
 P   ALTER TABLE public.tickets_status_history ALTER COLUMN id_history DROP DEFAULT;
       public          postgres    false    245    246    246                        2604    19500 '   tickets_status_lab id_ticket_status_lab    DEFAULT     �   ALTER TABLE ONLY public.tickets_status_lab ALTER COLUMN id_ticket_status_lab SET DEFAULT nextval('public.tickets_status_lab_id_ticket_status_lab_seq'::regclass);
 V   ALTER TABLE public.tickets_status_lab ALTER COLUMN id_ticket_status_lab DROP DEFAULT;
       public          postgres    false    236    237    237                       2604    19527 .   tickets_status_tickets id_ticket_status_ticket    DEFAULT     �   ALTER TABLE ONLY public.tickets_status_tickets ALTER COLUMN id_ticket_status_ticket SET DEFAULT nextval('public.tickets_status_tickets_id_ticket_status_ticket_seq'::regclass);
 ]   ALTER TABLE public.tickets_status_tickets ALTER COLUMN id_ticket_status_ticket DROP DEFAULT;
       public          postgres    false    241    240    241            �           2604    19205    users id_user    DEFAULT     n   ALTER TABLE ONLY public.users ALTER COLUMN id_user SET DEFAULT nextval('public.users_id_user_seq'::regclass);
 <   ALTER TABLE public.users ALTER COLUMN id_user DROP DEFAULT;
       public          postgres    false    216    215    216            �           2604    19417    users_tickets id_user_ticket    DEFAULT     �   ALTER TABLE ONLY public.users_tickets ALTER COLUMN id_user_ticket SET DEFAULT nextval('public.users_tickets_id_user_ticket_seq'::regclass);
 K   ALTER TABLE public.users_tickets ALTER COLUMN id_user_ticket DROP DEFAULT;
       public          postgres    false    230    229    230                      0    19775    accions_tickets 
   TABLE DATA           O   COPY public.accions_tickets (id_accion_ticket, name_accion_ticket) FROM stdin;
    public          postgres    false    249   �       �          0    19316    areas 
   TABLE DATA           3   COPY public.areas (id_area, name_area) FROM stdin;
    public          postgres    false    226   R�       �          0    19351    assignments_tickets 
   TABLE DATA           �   COPY public.assignments_tickets (id_assginment_ticket, id_ticket, id_coordinator, id_tecnico, date_sendcoordinator, note, date_assign_tec2) FROM stdin;
    public          postgres    false    227   ��       �          0    19460    failures 
   TABLE DATA           N   COPY public.failures (id_failure, name_failure, id_failure_level) FROM stdin;
    public          postgres    false    232   ��       �          0    19548    levels_tecnicos 
   TABLE DATA           T   COPY public.levels_tecnicos (id_level_tecnico, name_level, description) FROM stdin;
    public          postgres    false    243   ��                 0    19770    process_tickets 
   TABLE DATA           Q   COPY public.process_tickets (id_process_ticket, name_process_ticket) FROM stdin;
    public          postgres    false    248   �       �          0    19274    regions 
   TABLE DATA           I   COPY public.regions (id_region, name_region, "id_statusReg") FROM stdin;
    public          postgres    false    222   =�       �          0    19288    regionstecnicos 
   TABLE DATA           Q   COPY public.regionstecnicos (id_regionstecnicos, id_region, id_user) FROM stdin;
    public          postgres    false    224   ��       �          0    19255    roles 
   TABLE DATA           4   COPY public.roles (id_rolusr, name_rol) FROM stdin;
    public          postgres    false    218   ��                 0    19751    sessions_users 
   TABLE DATA           �   COPY public.sessions_users (id_session, id_user, start_date, user_agent, ip_address, active, end_date, expiry_time) FROM stdin;
    public          postgres    false    247   �       �          0    19267    states 
   TABLE DATA           A   COPY public.states (id_state, name_state, id_region) FROM stdin;
    public          postgres    false    220   "�       �          0    19490 
   status_lab 
   TABLE DATA           D   COPY public.status_lab (id_status_lab, name_status_lab) FROM stdin;
    public          postgres    false    235   	�                 0    20059    status_payments 
   TABLE DATA           Q   COPY public.status_payments (id_status_payment, name_status_payment) FROM stdin;
    public          postgres    false    253   &�       �          0    19516    status_tickets 
   TABLE DATA           N   COPY public.status_tickets (id_status_ticket, name_status_ticket) FROM stdin;
    public          postgres    false    239   C�                 0    19860 	   ticket_n1 
   TABLE DATA           �   COPY public.ticket_n1 (id_ticket, date_create, id_user, serial_pos, id_status_ticket, id_process_ticket, id_accion_ticket, descrip_failure, id_level_failure) FROM stdin;
    public          postgres    false    251   ��       �          0    19472    tickets_failures 
   TABLE DATA           T   COPY public.tickets_failures (id_ticket_failure, id_ticket, id_failure) FROM stdin;
    public          postgres    false    233   ��       �          0    19368    tickets_n2. 
   TABLE DATA           �  COPY public."tickets_n2." (id_ticket, id_status_ticket, date_create_ticket, serial_pos, downl_exoneration, downl_payment, downl_send_to_rosal, date_send_lab, date_send_torosal_fromlab, id_status_domiciliacion, date_sendkey, date_receivekey, downl_send_fromrosal, date_receivefrom_desti, motive_close, fails_customer, id_process_ticket, id_accion_ticket, id_status_payment, id_user_coord, id_failure, id_level_failure) FROM stdin;
    public          postgres    false    228   ��                  0    19668    tickets_status_history 
   TABLE DATA           �   COPY public.tickets_status_history (id_history, id_ticket, old_status, new_status, changed_by, changed_at, notes, old_process, new_process, old_action, new_action) FROM stdin;
    public          postgres    false    246   �       �          0    19497    tickets_status_lab 
   TABLE DATA           \   COPY public.tickets_status_lab (id_ticket_status_lab, id_ticket, id_status_lab) FROM stdin;
    public          postgres    false    237   /�       �          0    19524    tickets_status_tickets 
   TABLE DATA           }   COPY public.tickets_status_tickets (id_ticket_status_ticket, id_ticket, id_status_ticket, "date _status_ticket") FROM stdin;
    public          postgres    false    241   L�       �          0    19202    users 
   TABLE DATA           �   COPY public.users (id_user, national_id, id_statususr, name, surname, username, password, id_rolusr, email, id_area, trying_failedpassw, date_create, id_level_tecnico) FROM stdin;
    public          postgres    false    216   i�       �          0    19414    users_tickets 
   TABLE DATA           K   COPY public.users_tickets (id_user_ticket, id_user, id_ticket) FROM stdin;
    public          postgres    false    230   ��       #           0    0    departments_id_department_seq    SEQUENCE SET     K   SELECT pg_catalog.setval('public.departments_id_department_seq', 3, true);
          public          postgres    false    225            $           0    0    failures_id_failure_seq    SEQUENCE SET     F   SELECT pg_catalog.setval('public.failures_id_failure_seq', 42, true);
          public          postgres    false    231            %           0    0 $   levels_tecnicos_id_level_tecnico_seq    SEQUENCE SET     S   SELECT pg_catalog.setval('public.levels_tecnicos_id_level_tecnico_seq', 1, false);
          public          postgres    false    242            &           0    0    regions_id_region_seq    SEQUENCE SET     C   SELECT pg_catalog.setval('public.regions_id_region_seq', 6, true);
          public          postgres    false    221            '           0    0 &   regionstecnicos_id_regionstecnicos_seq    SEQUENCE SET     U   SELECT pg_catalog.setval('public.regionstecnicos_id_regionstecnicos_seq', 1, false);
          public          postgres    false    223            (           0    0    roles_id_rolusr_seq    SEQUENCE SET     A   SELECT pg_catalog.setval('public.roles_id_rolusr_seq', 2, true);
          public          postgres    false    217            )           0    0    states_id_state_seq    SEQUENCE SET     B   SELECT pg_catalog.setval('public.states_id_state_seq', 22, true);
          public          postgres    false    219            *           0    0    status_lab_id_status_lab_seq    SEQUENCE SET     K   SELECT pg_catalog.setval('public.status_lab_id_status_lab_seq', 1, false);
          public          postgres    false    234            +           0    0 %   status_payments_id_status_payment_seq    SEQUENCE SET     S   SELECT pg_catalog.setval('public.status_payments_id_status_payment_seq', 8, true);
          public          postgres    false    252            ,           0    0 #   status_tickets_id_status_ticket_seq    SEQUENCE SET     R   SELECT pg_catalog.setval('public.status_tickets_id_status_ticket_seq', 1, false);
          public          postgres    false    238            -           0    0    ticket_n1_id_ticket_seq    SEQUENCE SET     E   SELECT pg_catalog.setval('public.ticket_n1_id_ticket_seq', 1, true);
          public          postgres    false    250            .           0    0 %   tickets_status_history_id_history_seq    SEQUENCE SET     T   SELECT pg_catalog.setval('public.tickets_status_history_id_history_seq', 1, false);
          public          postgres    false    245            /           0    0 +   tickets_status_lab_id_ticket_status_lab_seq    SEQUENCE SET     Z   SELECT pg_catalog.setval('public.tickets_status_lab_id_ticket_status_lab_seq', 1, false);
          public          postgres    false    236            0           0    0 2   tickets_status_tickets_id_ticket_status_ticket_seq    SEQUENCE SET     a   SELECT pg_catalog.setval('public.tickets_status_tickets_id_ticket_status_ticket_seq', 1, false);
          public          postgres    false    240            1           0    0    users_id_user_seq    SEQUENCE SET     ?   SELECT pg_catalog.setval('public.users_id_user_seq', 2, true);
          public          postgres    false    215            2           0    0     users_tickets_id_user_ticket_seq    SEQUENCE SET     O   SELECT pg_catalog.setval('public.users_tickets_id_user_ticket_seq', 1, false);
          public          postgres    false    229            B           2606    19779 $   accions_tickets accions_tickets_pkey 
   CONSTRAINT     p   ALTER TABLE ONLY public.accions_tickets
    ADD CONSTRAINT accions_tickets_pkey PRIMARY KEY (id_accion_ticket);
 N   ALTER TABLE ONLY public.accions_tickets DROP CONSTRAINT accions_tickets_pkey;
       public            postgres    false    249                       2606    19321    areas departments_pkey 
   CONSTRAINT     Y   ALTER TABLE ONLY public.areas
    ADD CONSTRAINT departments_pkey PRIMARY KEY (id_area);
 @   ALTER TABLE ONLY public.areas DROP CONSTRAINT departments_pkey;
       public            postgres    false    226                       2606    19376 *   assignments_tickets pk_assignments_tickets 
   CONSTRAINT     z   ALTER TABLE ONLY public.assignments_tickets
    ADD CONSTRAINT pk_assignments_tickets PRIMARY KEY (id_assginment_ticket);
 T   ALTER TABLE ONLY public.assignments_tickets DROP CONSTRAINT pk_assignments_tickets;
       public            postgres    false    227            &           2606    19465    failures pk_failures 
   CONSTRAINT     Z   ALTER TABLE ONLY public.failures
    ADD CONSTRAINT pk_failures PRIMARY KEY (id_failure);
 >   ALTER TABLE ONLY public.failures DROP CONSTRAINT pk_failures;
       public            postgres    false    232            :           2606    19553 "   levels_tecnicos pk_levels_tecnicos 
   CONSTRAINT     n   ALTER TABLE ONLY public.levels_tecnicos
    ADD CONSTRAINT pk_levels_tecnicos PRIMARY KEY (id_level_tecnico);
 L   ALTER TABLE ONLY public.levels_tecnicos DROP CONSTRAINT pk_levels_tecnicos;
       public            postgres    false    243            ,           2606    19495    status_lab pk_status_lab 
   CONSTRAINT     a   ALTER TABLE ONLY public.status_lab
    ADD CONSTRAINT pk_status_lab PRIMARY KEY (id_status_lab);
 B   ALTER TABLE ONLY public.status_lab DROP CONSTRAINT pk_status_lab;
       public            postgres    false    235            F           2606    20064 "   status_payments pk_status_payments 
   CONSTRAINT     o   ALTER TABLE ONLY public.status_payments
    ADD CONSTRAINT pk_status_payments PRIMARY KEY (id_status_payment);
 L   ALTER TABLE ONLY public.status_payments DROP CONSTRAINT pk_status_payments;
       public            postgres    false    253            2           2606    19521     status_tickets pk_status_tickets 
   CONSTRAINT     l   ALTER TABLE ONLY public.status_tickets
    ADD CONSTRAINT pk_status_tickets PRIMARY KEY (id_status_ticket);
 J   ALTER TABLE ONLY public.status_tickets DROP CONSTRAINT pk_status_tickets;
       public            postgres    false    239            D           2606    19867    ticket_n1 pk_ticket_n1 
   CONSTRAINT     [   ALTER TABLE ONLY public.ticket_n1
    ADD CONSTRAINT pk_ticket_n1 PRIMARY KEY (id_ticket);
 @   ALTER TABLE ONLY public.ticket_n1 DROP CONSTRAINT pk_ticket_n1;
       public            postgres    false    251                       2606    19374    tickets_n2. pk_tickets 
   CONSTRAINT     ]   ALTER TABLE ONLY public."tickets_n2."
    ADD CONSTRAINT pk_tickets PRIMARY KEY (id_ticket);
 B   ALTER TABLE ONLY public."tickets_n2." DROP CONSTRAINT pk_tickets;
       public            postgres    false    228            (           2606    19476 $   tickets_failures pk_tickets_failures 
   CONSTRAINT     q   ALTER TABLE ONLY public.tickets_failures
    ADD CONSTRAINT pk_tickets_failures PRIMARY KEY (id_ticket_failure);
 N   ALTER TABLE ONLY public.tickets_failures DROP CONSTRAINT pk_tickets_failures;
       public            postgres    false    233            .           2606    19502 (   tickets_status_lab pk_tickets_status_lab 
   CONSTRAINT     x   ALTER TABLE ONLY public.tickets_status_lab
    ADD CONSTRAINT pk_tickets_status_lab PRIMARY KEY (id_ticket_status_lab);
 R   ALTER TABLE ONLY public.tickets_status_lab DROP CONSTRAINT pk_tickets_status_lab;
       public            postgres    false    237            4           2606    19529 0   tickets_status_tickets pk_tickets_status_tickets 
   CONSTRAINT     �   ALTER TABLE ONLY public.tickets_status_tickets
    ADD CONSTRAINT pk_tickets_status_tickets PRIMARY KEY (id_ticket_status_ticket);
 Z   ALTER TABLE ONLY public.tickets_status_tickets DROP CONSTRAINT pk_tickets_status_tickets;
       public            postgres    false    241                        2606    19419    users_tickets pk_users_tickets  
   CONSTRAINT     k   ALTER TABLE ONLY public.users_tickets
    ADD CONSTRAINT "pk_users_tickets " PRIMARY KEY (id_user_ticket);
 K   ALTER TABLE ONLY public.users_tickets DROP CONSTRAINT "pk_users_tickets ";
       public            postgres    false    230            @           2606    19774 $   process_tickets process_tickets_pkey 
   CONSTRAINT     q   ALTER TABLE ONLY public.process_tickets
    ADD CONSTRAINT process_tickets_pkey PRIMARY KEY (id_process_ticket);
 N   ALTER TABLE ONLY public.process_tickets DROP CONSTRAINT process_tickets_pkey;
       public            postgres    false    248                       2606    19279    regions regions_pkey 
   CONSTRAINT     Y   ALTER TABLE ONLY public.regions
    ADD CONSTRAINT regions_pkey PRIMARY KEY (id_region);
 >   ALTER TABLE ONLY public.regions DROP CONSTRAINT regions_pkey;
       public            postgres    false    222                       2606    19293 $   regionstecnicos regionstecnicos_pkey 
   CONSTRAINT     r   ALTER TABLE ONLY public.regionstecnicos
    ADD CONSTRAINT regionstecnicos_pkey PRIMARY KEY (id_regionstecnicos);
 N   ALTER TABLE ONLY public.regionstecnicos DROP CONSTRAINT regionstecnicos_pkey;
       public            postgres    false    224                       2606    19260    roles roles_pkey 
   CONSTRAINT     U   ALTER TABLE ONLY public.roles
    ADD CONSTRAINT roles_pkey PRIMARY KEY (id_rolusr);
 :   ALTER TABLE ONLY public.roles DROP CONSTRAINT roles_pkey;
       public            postgres    false    218            >           2606    19759 "   sessions_users sessions_users_pkey 
   CONSTRAINT     h   ALTER TABLE ONLY public.sessions_users
    ADD CONSTRAINT sessions_users_pkey PRIMARY KEY (id_session);
 L   ALTER TABLE ONLY public.sessions_users DROP CONSTRAINT sessions_users_pkey;
       public            postgres    false    247                       2606    19272    states states_pkey 
   CONSTRAINT     V   ALTER TABLE ONLY public.states
    ADD CONSTRAINT states_pkey PRIMARY KEY (id_state);
 <   ALTER TABLE ONLY public.states DROP CONSTRAINT states_pkey;
       public            postgres    false    220            <           2606    19673 2   tickets_status_history tickets_status_history_pkey 
   CONSTRAINT     x   ALTER TABLE ONLY public.tickets_status_history
    ADD CONSTRAINT tickets_status_history_pkey PRIMARY KEY (id_history);
 \   ALTER TABLE ONLY public.tickets_status_history DROP CONSTRAINT tickets_status_history_pkey;
       public            postgres    false    246                       2606    19397 :   assignments_tickets unq_assignments_tickets_id_coordinator 
   CONSTRAINT        ALTER TABLE ONLY public.assignments_tickets
    ADD CONSTRAINT unq_assignments_tickets_id_coordinator UNIQUE (id_coordinator);
 d   ALTER TABLE ONLY public.assignments_tickets DROP CONSTRAINT unq_assignments_tickets_id_coordinator;
       public            postgres    false    227                       2606    19383 5   assignments_tickets unq_assignments_tickets_id_ticket 
   CONSTRAINT     u   ALTER TABLE ONLY public.assignments_tickets
    ADD CONSTRAINT unq_assignments_tickets_id_ticket UNIQUE (id_ticket);
 _   ALTER TABLE ONLY public.assignments_tickets DROP CONSTRAINT unq_assignments_tickets_id_ticket;
       public            postgres    false    227                       2606    19565 +   regionstecnicos unq_regionstecnicos_id_user 
   CONSTRAINT     i   ALTER TABLE ONLY public.regionstecnicos
    ADD CONSTRAINT unq_regionstecnicos_id_user UNIQUE (id_user);
 U   ALTER TABLE ONLY public.regionstecnicos DROP CONSTRAINT unq_regionstecnicos_id_user;
       public            postgres    false    224            *           2606    19483 /   tickets_failures unq_tickets_failures_id_ticket 
   CONSTRAINT     o   ALTER TABLE ONLY public.tickets_failures
    ADD CONSTRAINT unq_tickets_failures_id_ticket UNIQUE (id_ticket);
 Y   ALTER TABLE ONLY public.tickets_failures DROP CONSTRAINT unq_tickets_failures_id_ticket;
       public            postgres    false    233            0           2606    19509 3   tickets_status_lab unq_tickets_status_lab_id_ticket 
   CONSTRAINT     s   ALTER TABLE ONLY public.tickets_status_lab
    ADD CONSTRAINT unq_tickets_status_lab_id_ticket UNIQUE (id_ticket);
 ]   ALTER TABLE ONLY public.tickets_status_lab DROP CONSTRAINT unq_tickets_status_lab_id_ticket;
       public            postgres    false    237            6           2606    19879 B   tickets_status_tickets unq_tickets_status_tickets_id_status_ticket 
   CONSTRAINT     �   ALTER TABLE ONLY public.tickets_status_tickets
    ADD CONSTRAINT unq_tickets_status_tickets_id_status_ticket UNIQUE (id_status_ticket);
 l   ALTER TABLE ONLY public.tickets_status_tickets DROP CONSTRAINT unq_tickets_status_tickets_id_status_ticket;
       public            postgres    false    241            8           2606    19541 ;   tickets_status_tickets unq_tickets_status_tickets_id_ticket 
   CONSTRAINT     {   ALTER TABLE ONLY public.tickets_status_tickets
    ADD CONSTRAINT unq_tickets_status_tickets_id_ticket UNIQUE (id_ticket);
 e   ALTER TABLE ONLY public.tickets_status_tickets DROP CONSTRAINT unq_tickets_status_tickets_id_ticket;
       public            postgres    false    241            "           2606    19421 )   users_tickets unq_users_tickets_id_ticket 
   CONSTRAINT     i   ALTER TABLE ONLY public.users_tickets
    ADD CONSTRAINT unq_users_tickets_id_ticket UNIQUE (id_ticket);
 S   ALTER TABLE ONLY public.users_tickets DROP CONSTRAINT unq_users_tickets_id_ticket;
       public            postgres    false    230            $           2606    19428 '   users_tickets unq_users_tickets_id_user 
   CONSTRAINT     e   ALTER TABLE ONLY public.users_tickets
    ADD CONSTRAINT unq_users_tickets_id_user UNIQUE (id_user);
 Q   ALTER TABLE ONLY public.users_tickets DROP CONSTRAINT unq_users_tickets_id_user;
       public            postgres    false    230            
           2606    19207    users users_pkey 
   CONSTRAINT     S   ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id_user);
 :   ALTER TABLE ONLY public.users DROP CONSTRAINT users_pkey;
       public            postgres    false    216            K           2606    19305 #   regionstecnicos fk_regionestecnicos    FK CONSTRAINT     �   ALTER TABLE ONLY public.regionstecnicos
    ADD CONSTRAINT fk_regionestecnicos FOREIGN KEY (id_region) REFERENCES public.regions(id_region);
 M   ALTER TABLE ONLY public.regionstecnicos DROP CONSTRAINT fk_regionestecnicos;
       public          postgres    false    222    224    3344            P           2606    19937 &   sessions_users fk_sessions_users_users    FK CONSTRAINT     �   ALTER TABLE ONLY public.sessions_users
    ADD CONSTRAINT fk_sessions_users_users FOREIGN KEY (id_user) REFERENCES public.users(id_user);
 P   ALTER TABLE ONLY public.sessions_users DROP CONSTRAINT fk_sessions_users_users;
       public          postgres    false    216    3338    247            J           2606    19334    states fk_state_region    FK CONSTRAINT     �   ALTER TABLE ONLY public.states
    ADD CONSTRAINT fk_state_region FOREIGN KEY (id_region) REFERENCES public.regions(id_region);
 @   ALTER TABLE ONLY public.states DROP CONSTRAINT fk_state_region;
       public          postgres    false    222    220    3344            Q           2606    19932 &   ticket_n1 fk_ticket_n1_accions_tickets    FK CONSTRAINT     �   ALTER TABLE ONLY public.ticket_n1
    ADD CONSTRAINT fk_ticket_n1_accions_tickets FOREIGN KEY (id_accion_ticket) REFERENCES public.accions_tickets(id_accion_ticket);
 P   ALTER TABLE ONLY public.ticket_n1 DROP CONSTRAINT fk_ticket_n1_accions_tickets;
       public          postgres    false    249    3394    251            R           2606    19927 &   ticket_n1 fk_ticket_n1_process_tickets    FK CONSTRAINT     �   ALTER TABLE ONLY public.ticket_n1
    ADD CONSTRAINT fk_ticket_n1_process_tickets FOREIGN KEY (id_process_ticket) REFERENCES public.process_tickets(id_process_ticket);
 P   ALTER TABLE ONLY public.ticket_n1 DROP CONSTRAINT fk_ticket_n1_process_tickets;
       public          postgres    false    3392    251    248            S           2606    19922    ticket_n1 fk_ticket_n1_users    FK CONSTRAINT     �   ALTER TABLE ONLY public.ticket_n1
    ADD CONSTRAINT fk_ticket_n1_users FOREIGN KEY (id_user) REFERENCES public.users(id_user);
 F   ALTER TABLE ONLY public.ticket_n1 DROP CONSTRAINT fk_ticket_n1_users;
       public          postgres    false    3338    251    216            L           2606    19477 -   tickets_failures fk_tickets_failures_failures    FK CONSTRAINT     �   ALTER TABLE ONLY public.tickets_failures
    ADD CONSTRAINT fk_tickets_failures_failures FOREIGN KEY (id_failure) REFERENCES public.failures(id_failure);
 W   ALTER TABLE ONLY public.tickets_failures DROP CONSTRAINT fk_tickets_failures_failures;
       public          postgres    false    232    233    3366            M           2606    19503 (   tickets_status_lab fk_tickets_status_lab    FK CONSTRAINT     �   ALTER TABLE ONLY public.tickets_status_lab
    ADD CONSTRAINT fk_tickets_status_lab FOREIGN KEY (id_status_lab) REFERENCES public.status_lab(id_status_lab);
 R   ALTER TABLE ONLY public.tickets_status_lab DROP CONSTRAINT fk_tickets_status_lab;
       public          postgres    false    235    3372    237            N           2606    19885 0   tickets_status_tickets fk_tickets_status_tickets    FK CONSTRAINT     �   ALTER TABLE ONLY public.tickets_status_tickets
    ADD CONSTRAINT fk_tickets_status_tickets FOREIGN KEY (id_status_ticket) REFERENCES public.status_tickets(id_status_ticket);
 Z   ALTER TABLE ONLY public.tickets_status_tickets DROP CONSTRAINT fk_tickets_status_tickets;
       public          postgres    false    3378    239    241            O           2606    19868 3   tickets_status_tickets fk_tickets_status_tickets_n1    FK CONSTRAINT     �   ALTER TABLE ONLY public.tickets_status_tickets
    ADD CONSTRAINT fk_tickets_status_tickets_n1 FOREIGN KEY (id_ticket) REFERENCES public.ticket_n1(id_ticket);
 ]   ALTER TABLE ONLY public.tickets_status_tickets DROP CONSTRAINT fk_tickets_status_tickets_n1;
       public          postgres    false    251    3396    241            G           2606    19854    users fk_users_areas    FK CONSTRAINT     x   ALTER TABLE ONLY public.users
    ADD CONSTRAINT fk_users_areas FOREIGN KEY (id_area) REFERENCES public.areas(id_area);
 >   ALTER TABLE ONLY public.users DROP CONSTRAINT fk_users_areas;
       public          postgres    false    226    3350    216            H           2606    19592    users fk_users_levels_tecnicos    FK CONSTRAINT     �   ALTER TABLE ONLY public.users
    ADD CONSTRAINT fk_users_levels_tecnicos FOREIGN KEY (id_level_tecnico) REFERENCES public.levels_tecnicos(id_level_tecnico);
 H   ALTER TABLE ONLY public.users DROP CONSTRAINT fk_users_levels_tecnicos;
       public          postgres    false    3386    216    243            I           2606    19261    users fk_users_rolsusr    FK CONSTRAINT     ~   ALTER TABLE ONLY public.users
    ADD CONSTRAINT fk_users_rolsusr FOREIGN KEY (id_rolusr) REFERENCES public.roles(id_rolusr);
 @   ALTER TABLE ONLY public.users DROP CONSTRAINT fk_users_rolsusr;
       public          postgres    false    3340    216    218               2   x�3�J-.M�)��2�t�S((�ON-��2�K��LIL�������� ��      �   N   x�3�t��K̫J,�2�tL����,.)JL����2�I��I-Rp��I�,I�2�ʦ�&r�r��(�'�p��qqq A       �      x������ � �      �   �  x�}T�r1=���19$�0,��H�*�'�\M����&ZH9��'���=,�.ȅ�����21I!�����8P~���"�t�X�F����%���<��Xz��*:�Iz�V��D����M��C�`_̌t�;�xW&�F++�k ����B	D������z�e��hK$l(
g��1��a��(�˳�sKA,�ـ\���R,��\[��H������2r%ne�B��L^���4+���a���'H�t�NdbjW̼w�-���jղ��,�o�(�1m��i&�-��������? uW���b�`��{?]�\�m��c�>J�}j⮳������y���7��t/�bG,T�V;�(?�Ԝ`g���"���y�zd�vah���fk.�.��+�~&$�Q���{܆��q���V���)'�,�n��iÂ�`)�{v틻⊢��ć�g7���b��S7�fy[��d�����i;`����V;]HC=%��w��E�&�������Z��|o���ӖO�0j���[���1:��TԆ)�Ӕ">�����qe(�sqM�笻�w��}~=gB�U��Plb��|�
�6�7�W�g �D4X9Z �!?��$R�6��^*����d���y�#w�}{$H�u��Tɶ�+��/,���<���}!V���d�Yd�_;�B�%s4��x)���d������6��      �   c   x�]�1� �ᙞ�0&�=�]v ��@��Bt0N���g�Oh͚�	{�s�N�9E�*�W��u Cc�-�$%7�-��EC&V�m�A�+M            x�3��/�/*IU������ 8��      �   S   x�3�t�,.)�,�WpN,�,I��4�2��/�L�+I��9���"��	�O~��c^Jj1�g
���$�僸f���ə)Pm1z\\\ ��      �      x������ � �      �   H   x�3�.-H-rL����2�IM��L��2�t��/J��KL�/�2�rS��3sb�L9��3�K���1z\\\ QQ�         �  x�͖KϜ6��ï`�H���񍬪.Z)M6��M6\��h�__�v����^,���ܔ�j�6��+;��{����~�*��o��?�0o"c�on���闯)��}L�I�?$�O\���֔���&Pe(�w�~�������M�sS����'��y���W�[���;��pc�Mx�uF`�4/"L�q$K~��c��U��Ӆ�PV1� נ�D����Nܱ�u�dm�s�}��W�SQN�T2!N���0L����{�&$�Z�����T*y*�3B��#J&u�T�5�B�jٍ��6o��-�29^�J�s�1.���H&��������ݡ��6\��CD&�k�B�a\JQA(�H��%�Bͪ>`�#���ݨ���炮B%d6�
Cɤ��j�M�f�jz,w�51�]�*�<�"D�%��4�>ۮ�C���n�U3��J�\\�J�M�	f����d2����u�ح��*�0T����E�t�0��s�B�dmK[���G�ڣ���ڒ��.���4;����w0�AIZ���ʲ�<�������rA|L�W���@}�-8S/"J�҃�Z�;��`�W�,�#>1��- �1�A�l�3ba�\�JY9� ����H��TA/��W�Lԑ�`"��®՝)-H�:�����xS�kP�[��F��x"es�v[��C����;bry[�&�4|��?�<�������uha�.#��L���_Tp���?e�e��Y�$�'�y      �   �   x�-O9��0�ۯ�2wh��dMED2�2;��7��BC֐M����PԤ�,��U�� ���F_�75�t5�����M7N�yP��n��-u��62ō��<Ci��SZϱ'��
��O��$��;�'�c��d�r�2�؊�a��j�JN�؅��D�'����Vz�)����j���?6�9�h�Ɋg>�������L+TL�ơ�e�S�Y�      �      x������ � �            x������ � �      �   .   x�3�tL�L-*��2�t�S((�ON-��2�tN-*JL������ ݢ
�         G   x�3�4202�50�52S04�21�2��370�0�4�p�06222604�9�8S�
S�S�8�b���� ��O      �      x������ � �      �      x������ � �             x������ � �      �      x������ � �      �      x������ � �      �   �   x�M��
�@�u�/ʹպk]
v骛X�!0h���T!\��r�'�mן/L�q���+�ަy u8W�ulFI�Ě��Z�O�2C�:�Õ"ҩ����C�Ǹ���]ejC��,��}����4�2�      �      x������ � �     