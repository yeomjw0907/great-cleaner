import React, { useEffect, useMemo, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Check,
  ChevronDown,
  EyeOff,
  MessageCircle,
  MoveHorizontal,
  ShieldCheck,
} from "lucide-react";
import { Faq, ServiceLinks, reveal } from "./App";
import { homeServices, sampleRecords, services } from "./siteData.jsx";

function PageTitle({ title, description }) {
  useEffect(() => {
    document.title = title;
    document
      .querySelector('meta[name="description"]')
      ?.setAttribute("content", description);
  }, [title, description]);
  return null;
}

function BeforeAfterSlider() {
  const [position, setPosition] = useState(50);

  return (
    <div className="comparison-wrap">
      <div
        className="before-after"
        style={{ "--position": `${position}%` }}
      >
        <img
          className="comparison-image comparison-after"
          src="/images/trash-home-after.webp"
          alt="쓰레기집 청소를 마친 깨끗한 거실"
          draggable="false"
        />
        <div className="comparison-before" aria-hidden="true">
          <img
            className="comparison-image"
            src="/images/trash-home-before.webp"
            alt=""
            draggable="false"
          />
        </div>
        <span className="comparison-label label-before">청소 전</span>
        <span className="comparison-label label-after">청소 후</span>
        <input
          className="comparison-range"
          type="range"
          min="0"
          max="100"
          value={position}
          onChange={(event) => setPosition(Number(event.target.value))}
          aria-label="청소 전후 이미지 비교 위치"
        />
        <div className="comparison-handle" aria-hidden="true">
          <MoveHorizontal />
        </div>
      </div>
      <div className="comparison-copy">
        <span>쓰레기집 청소 · 아파트</span>
        <h3>쌓여 있던 생활폐기물부터 공간 세척까지</h3>
        <p>가운데 손잡이를 좌우로 움직여 청소 전후를 비교해 보세요.</p>
      </div>
    </div>
  );
}

export function HomePage({ onConsult }) {
  const { scrollY } = useScroll(),
    y = useTransform(scrollY, [0, 800], [0, 90]);
  return (
    <main>
      <PageTitle
        title="위대한 청소부 | 공간을 되살리는 기술"
        description="쓰레기집 청소, 특수청소, 유품정리, 폐기물 처리까지 공간 회복을 위한 전문 서비스."
      />
      <section className="hero home-hero">
        <motion.div className="hero-image" style={{ y }} />
        <div className="hero-shade" />
        <motion.div
          className="hero-copy"
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9 }}
        >
          <span className="eyebrow light">GREAT CLEANER · SPECIAL CARE</span>
          <h1>
            공간이 다시
            <br />
            <em>일상이 되도록.</em>
          </h1>
          <p>
            말하기 어려운 상황일수록 조용하고 정확하게.
            <br />
            필요한 서비스부터 차분히 안내합니다.
          </p>
          <div className="hero-actions">
            <button className="primary" onClick={onConsult}>
              비공개 상담 시작 <ArrowRight />
            </button>
            <a href="#find-service">
              서비스 찾기 <ChevronDown />
            </a>
          </div>
        </motion.div>
        <div className="hero-index">
          <span>01</span>
          <i />
          <b>HOME</b>
        </div>
      </section>
      <section className="home-intro section-pad">
        <motion.div {...reveal}>
          <span className="eyebrow">ONE TEAM, ONE STANDARD</span>
          <h2>
            한 번의 설명으로,
            <br />
            <em>정리부터 회복까지.</em>
          </h2>
        </motion.div>
        <motion.div {...reveal}>
          <p>
            쓰레기집 정리, 유품 분류, 폐기물 반출, 특수 세척은 서로 분리된 일이
            아닙니다. 위대한 청소부는 공간의 현재 상태를 보고 필요한 순서를 함께
            설계합니다.
          </p>
          <div className="trust-line">
            <ShieldCheck />
            <b>상담 내용 보호</b>
            <span>현장 사진과 개인 상황을 조심스럽게 다룹니다.</span>
          </div>
        </motion.div>
      </section>
      <section id="find-service" className="home-services section-pad">
        <motion.header {...reveal}>
          <span className="eyebrow light">FIND YOUR SERVICE</span>
          <h2>
            어떤 도움이
            <br />
            필요하신가요?
          </h2>
          <p>
            상황에 가까운 서비스를 선택하면 작업 범위와 과정을 자세히 볼 수
            있습니다.
          </p>
        </motion.header>
        <div className="home-service-grid">
          {homeServices.map((s, i) => {
            const Icon = s.icon;
            const active = services.some((x) => x.slug === s.slug);
            return active ? (
              <motion.div {...reveal} key={s.slug}>
                <Link to={`/${s.slug}`}>
                  <span>0{i + 1}</span>
                  <Icon />
                  <h3>{s.nav}</h3>
                  <p>{s.intro}</p>
                  <b>
                    자세히 보기 <ArrowRight />
                  </b>
                </Link>
              </motion.div>
            ) : (
              <motion.div {...reveal} className="coming" key={s.slug}>
                <div>
                  <span>0{i + 1}</span>
                  <Icon />
                  <h3>{s.nav}</h3>
                  <p>{s.intro}</p>
                  <b>
                    상담으로 안내 <MessageCircle />
                  </b>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>
      <section className="home-standard">
        <div className="standard-image">
          <img
            src="/images/detail-sanitation.png"
            alt="전문 장비로 세척 중인 작업자"
          />
        </div>
        <div className="standard-copy">
          <motion.div {...reveal}>
            <span className="eyebrow light">OUR STANDARD</span>
            <h2>
              보이지 않는 곳까지
              <br />
              <em>기준 있게.</em>
            </h2>
            <p>현장마다 상태는 달라도 지키는 원칙은 같습니다.</p>
          </motion.div>
          {[
            [
              "01",
              "먼저 듣습니다",
              "버릴 것보다 남겨야 할 것을 먼저 확인합니다.",
            ],
            [
              "02",
              "범위를 나눕니다",
              "정리, 반출, 세척, 탈취가 필요한 곳을 구분합니다.",
            ],
            [
              "03",
              "과정을 공유합니다",
              "작업 전후 확인할 내용을 고객과 약속합니다.",
            ],
            [
              "04",
              "끝을 확인합니다",
              "요청 범위가 마무리됐는지 함께 확인합니다.",
            ],
          ].map((x) => (
            <motion.div {...reveal} className="standard-row" key={x[0]}>
              <span>{x[0]}</span>
              <b>{x[1]}</b>
              <p>{x[2]}</p>
              <Check />
            </motion.div>
          ))}
        </div>
      </section>
      <section className="review-preview section-pad">
        <motion.div {...reveal}>
          <span className="eyebrow">FIELD NOTES</span>
          <h2>
            결과만이 아니라,
            <br />
            과정을 기록합니다.
          </h2>
          <p>
            현재는 홈페이지 구성을 확인할 수 있는 샘플 작업 기록입니다. 실제
            후기는 고객 동의를 받은 콘텐츠로 교체합니다.
          </p>
          <Link className="line-link" to="/reviews">
            작업후기 페이지 보기 <ArrowRight />
          </Link>
        </motion.div>
        <BeforeAfterSlider />
      </section>
      <FinalCta onConsult={onConsult} />
    </main>
  );
}
export function ServicePage({ data, onConsult }) {
  return (
    <main>
      <PageTitle
        title={`${data.nav} | 위대한 청소부`}
        description={data.intro}
      />
      <section
        className="service-hero"
        style={{ "--hero": `url(${data.image})` }}
      >
        <div className="service-hero-shade" />
        <motion.div
          className="service-hero-copy"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.85 }}
        >
          <span className="eyebrow light">{data.kicker}</span>
          <h1>{data.title}</h1>
          <p>{data.intro}</p>
          <button className="primary" onClick={onConsult}>
            이 서비스 상담하기 <ArrowRight />
          </button>
        </motion.div>
        <div className="service-number">
          SERVICE /{" "}
          {String(services.findIndex((x) => x.slug === data.slug) + 1).padStart(
            2,
            "0",
          )}
        </div>
      </section>
      <nav className="subnav">
        {services.map((s) => (
          <Link
            className={s.slug === data.slug ? "active" : ""}
            to={`/${s.slug}`}
            key={s.slug}
          >
            {s.nav}
          </Link>
        ))}
        <Link to="/reviews">작업후기</Link>
      </nav>
      <section className="situation section-pad">
        <motion.header {...reveal}>
          <span className="eyebrow">YOU ARE NOT ALONE</span>
          <h2>
            이런 상황이라면,
            <br />
            상담할 수 있습니다.
          </h2>
          <p>
            현재 상태를 평가하지 않습니다. 필요한 일을 정리하는 것부터
            시작합니다.
          </p>
        </motion.header>
        <div className="situation-list">
          {data.situations.map((s, i) => (
            <motion.div {...reveal} key={s}>
              <span>0{i + 1}</span>
              <p>{s}</p>
              <Check />
            </motion.div>
          ))}
        </div>
      </section>
      <section className="scope section-pad">
        <motion.header {...reveal}>
          <span className="eyebrow light">WORK SCOPE</span>
          <h2>
            {data.nav},<br />
            어디까지 하나요?
          </h2>
        </motion.header>
        <div className="scope-grid">
          {data.scope.map(([title, copy], i) => (
            <motion.article {...reveal} key={title}>
              <span>0{i + 1}</span>
              <h3>{title}</h3>
              <p>{copy}</p>
            </motion.article>
          ))}
        </div>
      </section>
      <section className="service-process section-pad">
        <motion.header {...reveal}>
          <span className="eyebrow">SERVICE PROCESS</span>
          <h2>
            복잡한 상황을
            <br />네 단계로 나눕니다.
          </h2>
        </motion.header>
        <div className="process-track">
          {data.process.map(([title, copy], i) => (
            <motion.article {...reveal} key={title}>
              <span>{String(i + 1).padStart(2, "0")}</span>
              <i />
              <h3>{title}</h3>
              <p>{copy}</p>
            </motion.article>
          ))}
        </div>
      </section>
      <section className="quote-band">
        <div>
          <EyeOff />
          <span>PRIVACY FIRST</span>
          <h2>
            말하기 어려운 이유까지
            <br />
            설명하지 않아도 괜찮습니다.
          </h2>
        </div>
        <p>
          작업에 필요한 내용만 확인합니다.
          <br />
          상담 기록과 현장 상황은 조심스럽게 다룹니다.
        </p>
      </section>
      <section className="factors section-pad">
        <motion.div {...reveal}>
          <span className="eyebrow">ESTIMATE GUIDE</span>
          <h2>
            견적은 무엇에 따라
            <br />
            달라지나요?
          </h2>
          <p>
            사진 한 장의 숫자로 단정하지 않습니다. 아래 조건을 함께 보고 실제
            필요한 작업 범위를 안내합니다.
          </p>
        </motion.div>
        <div className="factor-list">
          {data.factors.map((x, i) => (
            <motion.div {...reveal} key={x}>
              <span>0{i + 1}</span>
              <b>{x}</b>
              <Check />
            </motion.div>
          ))}
        </div>
      </section>
      <section className="service-faq section-pad">
        <motion.header {...reveal}>
          <span className="eyebrow">BEFORE YOU ASK</span>
          <h2>
            상담 전<br />
            많이 묻는 질문
          </h2>
        </motion.header>
        <Faq items={data.faqs} />
      </section>
      <section className="other-services section-pad">
        <span className="eyebrow">EXPLORE SERVICES</span>
        <h2>
          다른 서비스도
          <br />
          확인해 보세요.
        </h2>
        <ServiceLinks current={data.slug} />
      </section>
      <FinalCta onConsult={onConsult} />
    </main>
  );
}
export function ReviewsPage({ onConsult }) {
  const [filter, setFilter] = useState("전체");
  const types = ["전체", "쓰레기집", "폐기물", "유품정리", "특수청소"];
  const records = useMemo(
    () =>
      filter === "전체"
        ? sampleRecords
        : sampleRecords.filter((r) => r.type === filter),
    [filter],
  );
  return (
    <main>
      <PageTitle
        title="작업후기 | 위대한 청소부"
        description="위대한 청소부의 서비스별 작업 과정과 현장 기록을 확인하세요."
      />
      <section className="reviews-hero">
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <span className="eyebrow light">FIELD NOTES & REVIEWS</span>
          <h1>
            공간이 회복되는
            <br />
            <em>과정을 기록합니다.</em>
          </h1>
          <p>
            실제 후기와 현장 기록은 반드시 고객의 공개 동의를 받은 뒤
            게시합니다.
          </p>
        </motion.div>
        <div className="review-hero-image">
          <img
            src="/images/hero-restoration.png"
            alt="깨끗하게 복원된 공간을 마무리하는 작업자"
          />
        </div>
      </section>
      <section className="reviews-content section-pad">
        <div className="review-heading">
          <div>
            <span className="eyebrow">WORK ARCHIVE</span>
            <h2>
              서비스별
              <br />
              작업 기록
            </h2>
          </div>
          <p>
            <b>안내</b> 현재 보이는 콘텐츠는 홈페이지 레이아웃 확인을 위한 샘플
            작업 기록이며 실제 고객 후기가 아닙니다. 실제 운영 시 동의받은
            사진과 후기만 등록합니다.
          </p>
        </div>
        <div className="review-filter" role="tablist">
          {types.map((t) => (
            <button
              className={filter === t ? "active" : ""}
              onClick={() => setFilter(t)}
              key={t}
            >
              {t}
            </button>
          ))}
        </div>
        <motion.div layout className="record-grid">
          {records.map((r) => (
            <motion.article
              layout
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              key={r.title}
            >
              <div className="record-image">
                <img src={r.image} alt="" />
                <span>샘플 기록</span>
              </div>
              <div className="record-copy">
                <small>{r.meta}</small>
                <h3>{r.title}</h3>
                <p>{r.text}</p>
                <button onClick={onConsult}>
                  비슷한 상황 상담하기 <ArrowRight />
                </button>
              </div>
            </motion.article>
          ))}
        </motion.div>
      </section>
      <section className="review-policy section-pad">
        <motion.div {...reveal}>
          <ShieldCheck />
          <h2>
            후기는 신뢰를 위해
            <br />세 가지를 지킵니다.
          </h2>
        </motion.div>
        <div>
          {[
            ["01", "고객 동의", "사진과 후기의 공개 범위를 사전에 확인합니다."],
            [
              "02",
              "개인정보 보호",
              "이름, 주소, 식별 가능한 물건은 가리거나 제외합니다.",
            ],
            [
              "03",
              "과장 없는 기록",
              "확인되지 않은 수치나 결과를 후기처럼 만들지 않습니다.",
            ],
          ].map((x) => (
            <div key={x[0]}>
              <span>{x[0]}</span>
              <b>{x[1]}</b>
              <p>{x[2]}</p>
            </div>
          ))}
        </div>
      </section>
      <FinalCta onConsult={onConsult} />
    </main>
  );
}
function FinalCta({ onConsult }) {
  return (
    <section className="final-cta">
      <div className="final-bg" />
      <motion.div {...reveal}>
        <span className="eyebrow light">START YOUR RESTORATION</span>
        <h2>
          사진 몇 장이면
          <br />
          시작할 수 있습니다.
        </h2>
        <p>
          정확한 서비스 이름을 몰라도 괜찮습니다.
          <br />
          현재 상황을 보고 필요한 순서부터 안내합니다.
        </p>
        <button className="primary inverse" onClick={onConsult}>
          상담 요청서 작성 <MessageCircle />
        </button>
      </motion.div>
    </section>
  );
}
